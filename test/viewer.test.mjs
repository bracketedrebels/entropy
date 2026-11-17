import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { loadBundle, compileBundle } from '../scripts/compile.mjs';
import { layoutGraph, fitTransform } from '../viewer/layout.mjs';
const bundle = await loadBundle('examples/full-name/project.json');
const compiled = compileBundle(bundle);
const model = compiled.visualization;
const graph = (name) => model.graphs.find((g) => g.id === `fullname.${name}`);

test('compiler exports checked graph structure and each argument exactly once', () => {
  assert.equal(model.version, 1);
  assert.equal(model.entry, 'fullname.main');
  assert.equal(model.graphs.length, 6);
  assert.equal(model.elements.filter((e) => e.kind === 'native').length, 15);
  assert.deepEqual(model.signatures, compiled.signatures);
  for (const graph of model.graphs) {
    assert.equal(new Set(graph.nodes.map((n) => n.id)).size, graph.nodes.length);
    assert.equal(graph.nodes.filter((n) => n.kind === 'output').length, 1);
    for (const node of graph.nodes)
      node.inputs.forEach((input, port) => {
        const incoming = graph.edges.filter((e) => e.to === node.id && e.port === port);
        assert.equal(incoming.length, 1);
        assert.equal(incoming[0].type, input.type);
      });
    for (const edge of graph.edges) {
      assert.ok(graph.nodes.some((n) => n.id === edge.from));
      assert.ok(graph.nodes.some((n) => n.id === edge.to));
    }
  }
});
test('shared values, literals, schema and function references retain their meaning', () => {
  const name = graph('formatName');
  const input = name.nodes.find((n) => n.kind === 'input');
  assert.equal(input.label, 'person');
  assert.equal(name.edges.filter((e) => e.from === input.id).length, 2);
  assert.deepEqual(
    name.nodes
      .filter((n) => n.kind === 'field')
      .map((n) => n.value)
      .sort(),
    ['first', 'last'],
  );
  assert.ok(name.nodes.some((n) => n.kind === 'constant' && n.value === '" "'));
  const response = graph('prepareResponse');
  assert.equal(response.edges.filter((e) => e.kind === 'function').length, 2);
  assert.equal(response.edges.filter((e) => e.kind === 'config').length, 1);
  assert.deepEqual(model.elements.find((e) => e.id === 'fullname.person').schema, bundle.schemas['person.schema.json']);
  assert.deepEqual(model.sources, bundle.sources);
});
test('partial application exports a function value and dynamic call input', () => {
  const changed = structuredClone(bundle);
  changed.sources.at(-1).text = changed.sources
    .at(-1)
    .text.replace('(call std.join " " (vector first last))', '(call (partial std.join " ") (vector first last))');
  const partialGraph = compileBundle(changed).visualization.graphs.find((g) => g.id === 'fullname.formatName');
  const partial = partialGraph.nodes.find((n) => n.kind === 'partial');
  assert.equal(partial.inputs.length, 1);
  const edge = partialGraph.edges.find((e) => e.from === partial.id);
  assert.equal(edge.kind, 'function');
  assert.equal(partialGraph.nodes.find((n) => n.id === edge.to).inputs[edge.port].name, 'function');
});
test('layout is deterministic, preserves data and keeps nodes disjoint', () => {
  for (const graph of model.graphs) {
    const before = structuredClone(graph),
      layout = layoutGraph(graph);
    assert.deepEqual(layoutGraph(graph), layout);
    assert.deepEqual(graph, before);
    for (const a of layout.nodes)
      for (const b of layout.nodes)
        if (a !== b)
          assert.ok(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
    for (const e of layout.edges)
      assert.ok(layout.nodes.find((n) => n.id === e.from).x < layout.nodes.find((n) => n.id === e.to).x);
    for (const [width, height] of [
      [1280, 600],
      [390, 500],
      [0, 0],
    ]) {
      const fit = fitTransform(width, height, layout);
      assert.ok(Object.values(fit).every(Number.isFinite));
      assert.ok(fit.scale >= 0.15 && fit.scale <= 1.1);
    }
  }
});
test('layout rejects cycles, missing endpoints and invalid ports', () => {
  const node = (id) => ({ id, kind: 'call', inputs: [{ name: 'arg1', type: 'String' }] });
  assert.throws(
    () =>
      layoutGraph({
        nodes: [node('a'), node('b')],
        edges: [
          { from: 'a', to: 'b', port: 0 },
          { from: 'b', to: 'a', port: 0 },
        ],
      }),
    /Cycle/,
  );
  assert.throws(() => layoutGraph({ nodes: [node('a')], edges: [{ from: 'missing', to: 'a', port: 0 }] }), /endpoint/);
  assert.throws(() => layoutGraph({ nodes: [node('a'), node('b')], edges: [{ from: 'a', to: 'b', port: 5 }] }), /port/);
});
test('Pages uses relative assets and checked data without an executable backend', async () => {
  const html = await readFile('_site/index.html', 'utf8');
  assert.match(html, /src="\.\/app.mjs"/);
  assert.match(html, /href="\.\/style.css"/);
  const exported = JSON.parse(await readFile('_site/graph.json', 'utf8'));
  assert.deepEqual(exported.graphs, model.graphs);
  assert.deepEqual(exported.signatures, model.signatures);
  assert.equal(exported.sources.at(-1).path, 'examples/full-name/full-name.ent');
  assert.ok(!exported.javascript);
  await access('_site/.nojekyll');
  await assert.rejects(access('_site/full-name.mjs'));
});
