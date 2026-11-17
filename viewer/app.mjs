import { layoutGraph, inputY, fitTransform } from './layout.mjs';

const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const paths = {
  graph:
    '<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M6 9v9h9M9 6h9v9"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
  external: '<path d="M14 3h7v7m0-7L10 14M9 5H4v15h15v-5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  link: '<path d="m10 14 4-4m-6 6-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 -1)"/>',
  fit: '<path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  hand: '<path d="M8 12V6a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v7-4a2 2 0 0 1 4 0v8c0 4-3 6-6 6h-1c-2 0-3-1-4-2l-6-6a2 2 0 0 1 3-3l2 2Z"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-16-2 20"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  source: '<path d="M4 12h16m-6-6 6 6-6 6"/><circle cx="4" cy="12" r="2"/>',
  sink: '<path d="M3 12h12m-5-5 5 5-5 5m7-13h4v16h-4"/>',
  function: '<path d="M6 8h12M6 16h12m-5-13-2 18"/>',
  value: '<path d="m12 3 9 9-9 9-9-9Z"/>',
  input: '<path d="M3 12h17m-6-6 6 6-6 6"/>',
  output: '<path d="M3 12h15m-5-5 5 5-5 5m7-14v18"/>',
};
const icon = (name) => {
  const element = document.createElement('span');
  element.innerHTML = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] ?? paths.graph}</svg>`;
  return element;
};
for (const el of document.querySelectorAll('[data-icon]')) el.append(icon(el.dataset.icon).firstChild);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const svg = (tag, attributes) => {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  return node;
};
const state = {
  model: null,
  graph: null,
  layout: null,
  selected: null,
  transform: { x: 0, y: 0, scale: 1 },
  tab: 'graph',
  collapsed: new Set(),
  pan: null,
};
const short = (name) => name.split('.').at(-1);
const elementFor = (id) => state.model.elements.find((e) => e.id === id);
const sourceFor = (element) => state.model.sources.find((source) => source.name === element.file);
const sourceLink = (element) =>
  `${state.model.repository}/blob/${state.model.sourceRef}/${sourceFor(element).path}#L${element.line}`;
function navigate(graph, node) {
  const hash = new URLSearchParams({ graph });
  if (node) hash.set('node', node);
  if (location.hash.slice(1) === hash.toString()) route();
  else location.hash = hash.toString();
}
const narrowScreen = matchMedia('(max-width: 900px)');
function setSidebar(open) {
  if (!open && $('sidebar').contains(document.activeElement) && narrowScreen.matches) $('menu').focus();
  $('sidebar').inert = narrowScreen.matches && !open;
  $('sidebar').classList.toggle('open', open);
  $('scrim').hidden = !open;
  $('menu').setAttribute('aria-expanded', String(open));
}
function renderLibrary() {
  if (!state.model) return;
  const query = $('search').value.trim().toLowerCase();
  const groups = new Map();
  for (const item of state.model.elements) {
    if (query && !`${item.id} ${item.kind} ${item.role}`.toLowerCase().includes(query)) continue;
    if (!groups.has(item.module)) groups.set(item.module, []);
    groups.get(item.module).push(item);
  }
  const ordered = [...groups].sort(
    (a, b) => Number(!a[1].some((e) => e.kind === 'graph')) - Number(!b[1].some((e) => e.kind === 'graph')),
  );
  $('library').replaceChildren();
  if (!ordered.length) $('library').append(el('p', 'empty-library', 'No matching elements.'));
  for (const [module, items] of ordered) {
    const section = el('section', 'module-group');
    const toggle = el('button', 'module-toggle');
    toggle.append(icon('chevron'), el('span', '', module), el('span', 'module-count', items.length));
    const collapsed = !query && state.collapsed.has(module);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.addEventListener('click', () => {
      state.collapsed.has(module) ? state.collapsed.delete(module) : state.collapsed.add(module);
      renderLibrary();
    });
    section.append(toggle);
    if (!collapsed)
      for (const item of [...items].sort(
        (a, b) => Number(b.id === state.model.entry) - Number(a.id === state.model.entry),
      )) {
        const button = el(
          'button',
          `library-item ${item.kind === 'native' ? 'native' : ''}${state.graph?.id === item.id ? ' active' : ''}`,
        );
        button.setAttribute('aria-label', `${item.id}, ${item.kind} ${item.role}`);
        if (state.graph?.id === item.id) button.setAttribute('aria-current', 'page');
        button.append(icon(item.role), el('span', 'element-name', short(item.id)));
        if (item.kind !== 'graph') button.append(el('span', 'element-badge', item.kind === 'native' ? 'N' : 'S'));
        button.addEventListener('click', () => {
          if (item.kind === 'graph') {
            navigate(item.id);
            setView('graph');
          } else inspectElement(item);
          setSidebar(false);
        });
        section.append(button);
      }
    $('library').append(section);
  }
}
function route() {
  if (!state.model) return;
  const params = new URLSearchParams(location.hash.slice(1));
  const requested = params.get('graph') ?? state.model.entry;
  const graph =
    state.model.graphs.find((g) => g.id === requested) ?? state.model.graphs.find((g) => g.id === state.model.entry);
  if (!state.graph || state.graph.id !== graph.id) {
    state.graph = graph;
    renderGraph();
  }
  renderLibrary();
  const selected = graph.nodes.find((n) => n.id === params.get('node'));
  selected ? inspectNode(selected) : closeInspector();
}
function renderGraph() {
  state.layout = layoutGraph(state.graph);
  const definition = elementFor(state.graph.id);
  $('entry-link').textContent = definition.module;
  $('graph-name').textContent = short(definition.id);
  $('graph-role').textContent = definition.role;
  $('graph-summary').textContent = `${state.graph.nodes.length} nodes · ${state.graph.edges.length} connections`;
  $('signature').textContent = state.model.signatures[definition.id];
  $('definition-link').href = sourceLink(definition);
  $('status-text').textContent = sourceFor(definition).path;
  $('nodes').replaceChildren();
  $('connections').replaceChildren();
  $('world').style.width = `${state.layout.width}px`;
  $('world').style.height = `${state.layout.height}px`;
  $('connections').setAttribute('width', state.layout.width);
  $('connections').setAttribute('height', state.layout.height);
  for (const edge of state.layout.edges) {
    const path = svg('path', {
      d: edge.path,
      class: 'edge',
      'data-kind': edge.kind,
      'data-from': edge.from,
      'data-to': edge.to,
    });
    const title = svg('title', {});
    title.textContent = edge.type;
    path.append(title);
    $('connections').append(path);
  }
  for (const node of state.layout.nodes) {
    const button = el('button', 'graph-node');
    button.dataset.nodeId = node.id;
    button.dataset.kind = node.kind;
    button.dataset.role = node.role;
    button.setAttribute('aria-label', `${node.label}, ${node.kind}, ${node.type}`);
    button.setAttribute('aria-pressed', 'false');
    Object.assign(button.style, {
      left: `${node.x}px`,
      top: `${node.y}px`,
      width: `${node.width}px`,
      height: `${node.height}px`,
    });
    const top = el('span', 'node-top');
    const glyph = el('span', 'node-icon');
    glyph.append(icon(node.role));
    const title = el('span');
    title.append(
      el('span', 'node-title', short(node.label)),
      el('span', 'node-kind', `${node.kind === 'call' ? node.role : node.kind}${node.native ? ' · native' : ''}`),
    );
    top.append(glyph, title);
    button.append(top);
    if (node.kind !== 'output')
      button.append(
        el(
          'span',
          'node-detail',
          node.value || node.symbol || node.inputs.map((p) => p.name).join(' · ') || 'open input',
        ),
      );
    button.append(el('span', 'node-type', node.type));
    node.inputs.forEach((input, index) => {
      const edge = state.graph.edges.find((e) => e.to === node.id && e.port === index);
      const port = el('span', `port ${edge?.kind ?? ''}`);
      port.style.top = `${inputY(node, index)}px`;
      port.title = `${input.name}: ${input.type}`;
      button.append(port);
    });
    if (node.kind !== 'output') button.append(el('span', 'port out'));
    button.addEventListener('click', () => navigate(state.graph.id, node.id));
    button.addEventListener('dblclick', () => {
      if (state.model.graphs.some((g) => g.id === node.symbol)) navigate(node.symbol);
    });
    $('nodes').append(button);
  }
  renderSource(definition);
  renderMinimap();
  requestAnimationFrame(() => fit());
}
function renderSource(definition) {
  const source = sourceFor(definition);
  $('source-name').textContent = source.path;
  const next = state.model.elements
    .filter((e) => e.file === definition.file && e.line > definition.line)
    .sort((a, b) => a.line - b.line)[0];
  $('source-code').replaceChildren();
  source.text.split('\n').forEach((text, index) => {
    const number = index + 1;
    const line = el(
      'span',
      `source-line${number >= definition.line && number < (next?.line ?? Infinity) ? ' marked' : ''}`,
    );
    line.append(el('span', 'line-number', number), document.createTextNode(text || ' '));
    $('source-code').append(line);
  });
}
function detail(label, text) {
  $('inspector-content').append(el('span', 'detail-label', label), el('pre', '', text));
}
function inspectNode(node) {
  state.selected = node.id;
  $('inspector').hidden = false;
  $('inspector-content').replaceChildren();
  const definition = node.symbol ? elementFor(node.symbol) : null;
  $('inspector-content').append(
    el('h2', '', short(node.label)),
    el(
      'p',
      'meta',
      [node.kind, node.native ? 'native element' : node.symbol ? 'Entropy element' : 'graph expression', node.symbol]
        .filter(Boolean)
        .join(' · '),
    ),
  );
  detail('Type in this graph', node.type);
  if (definition) detail('Element signature', state.model.signatures[definition.id]);
  if (node.value) detail(node.kind === 'constant' ? 'Value' : 'Field', node.value);
  if (node.inputs.length) {
    $('inspector-content').append(el('span', 'detail-label', 'Input ports'));
    for (const input of node.inputs) {
      const row = el('div', 'input-detail');
      row.append(el('span', '', input.name), el('code', '', input.type));
      $('inspector-content').append(row);
    }
  }
  if (definition) definitionDetails(definition);
  highlight(node.id);
}
function inspectElement(definition) {
  setView('graph');
  state.selected = null;
  highlight(null);
  $('inspector').hidden = false;
  $('inspector-content').replaceChildren();
  $('inspector-content').append(
    el('h2', '', short(definition.id)),
    el('p', 'meta', `${definition.kind} ${definition.role} · ${definition.module}`),
  );
  detail('Element signature', state.model.signatures[definition.id]);
  definitionDetails(definition);
}
function definitionDetails(definition) {
  if (definition.schema) detail('JSON Schema · Draft 7', JSON.stringify(definition.schema, null, 2));
  if (definition.kind === 'graph') {
    const button = el('button', 'open-graph', 'Open subgraph →');
    button.addEventListener('click', () => navigate(definition.id));
    $('inspector-content').append(button);
  }
  const link = el('a', '', 'View definition');
  link.href = sourceLink(definition);
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.append(icon('external'));
  $('inspector-content').append(link);
}
function highlight(id) {
  const related = new Set([id]);
  for (const edge of state.graph.edges)
    if (edge.from === id || edge.to === id) {
      related.add(edge.from);
      related.add(edge.to);
    }
  for (const node of $('nodes').children) {
    const selected = node.dataset.nodeId === id;
    node.classList.toggle('selected', selected);
    node.setAttribute('aria-pressed', String(selected));
    node.classList.toggle('dim', !!id && !related.has(node.dataset.nodeId));
  }
  for (const edge of $('connections').children) {
    const related = edge.dataset.from === id || edge.dataset.to === id;
    edge.classList.toggle('highlight', !!id && related);
    edge.classList.toggle('dim', !!id && !related);
  }
}
function closeInspector() {
  $('inspector').hidden = true;
  state.selected = null;
  if (state.graph) highlight(null);
}
function renderMinimap() {
  const { width, height, edges, nodes } = state.layout;
  $('minimap').replaceChildren();
  $('minimap').setAttribute('viewBox', `-25 -25 ${width + 50} ${height + 50}`);
  for (const edge of edges) $('minimap').append(svg('path', { d: edge.path, class: 'mini-edge' }));
  for (const node of nodes)
    $('minimap').append(
      svg('rect', {
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        rx: 10,
        class: 'mini-node',
        'data-role': node.role,
      }),
    );
  $('minimap').append(svg('rect', { id: 'mini-view', class: 'mini-view' }));
}
function transform() {
  const { x, y, scale } = state.transform;
  $('world').style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  $('zoom-level').value = `${Math.round(scale * 100)}%`;
  const view = $('mini-view');
  if (view)
    for (const [key, value] of Object.entries({
      x: -x / scale,
      y: -y / scale,
      width: $('viewport').clientWidth / scale,
      height: $('viewport').clientHeight / scale,
    }))
      view.setAttribute(key, value);
}
function fit(overview = false) {
  if (!state.layout || state.tab !== 'graph') return;
  const width = $('viewport').clientWidth,
    height = $('viewport').clientHeight;
  state.transform = fitTransform(width, height - 50, state.layout, width < 600 ? 30 : 52);
  state.transform.y += 8;
  if (width < 600 && !overview)
    state.transform = { scale: 0.85, x: 22, y: Math.max(68, (height - 80 - state.layout.height * 0.85) / 2) };
  transform();
}
function zoom(factor, point) {
  const box = $('viewport').getBoundingClientRect();
  const { scale, x, y } = state.transform;
  const next = Math.max(0.15, Math.min(2, scale * factor));
  const px = point ? point.x - box.left : box.width / 2,
    py = point ? point.y - box.top : box.height / 2;
  state.transform = { scale: next, x: px - ((px - x) * next) / scale, y: py - ((py - y) * next) / scale };
  transform();
}
function setView(tab) {
  state.tab = tab;
  for (const name of ['graph', 'source']) {
    const active = name === tab;
    $(`${name}-tab`).setAttribute('aria-selected', String(active));
    $(`${name}-tab`).tabIndex = active ? 0 : -1;
  }
  $('canvas-stage').hidden = tab !== 'graph';
  $('source-view').hidden = tab !== 'source';
  if (tab === 'graph') requestAnimationFrame(() => fit());
  else
    requestAnimationFrame(() => {
      const marked = $('source-code').querySelector('.marked');
      if (marked) $('source-view').scrollTop = Math.max(0, marked.offsetTop - $('source-view').offsetTop - 70);
    });
}
let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => {
    $('toast').hidden = true;
  }, 2600);
}
$('search').addEventListener('input', renderLibrary);
$('menu').addEventListener('click', () => setSidebar(!$('sidebar').classList.contains('open')));
$('scrim').addEventListener('click', () => setSidebar(false));
$('entry-link').addEventListener('click', () => {
  if (state.model) navigate(state.model.entry);
});
$('graph-tab').addEventListener('click', () => setView('graph'));
$('source-tab').addEventListener('click', () => setView('source'));
for (const name of ['graph', 'source'])
  $(`${name}-tab`).addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const next = name === 'graph' ? 'source' : 'graph';
      setView(next);
      $(`${next}-tab`).focus();
    }
  });
$('show-types').addEventListener('change', (event) =>
  $('canvas-stage').classList.toggle('hide-types', !event.target.checked),
);
$('close-inspector').addEventListener('click', () => {
  if (state.selected) navigate(state.graph.id);
  else closeInspector();
});
$('zoom-in').addEventListener('click', () => zoom(1.2));
$('zoom-out').addEventListener('click', () => zoom(1 / 1.2));
$('fit-view').addEventListener('click', () => fit(true));
$('copy-link').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    toast('Graph link copied');
  } catch {
    toast('Copy this page’s address to share the graph.');
  }
});
$('viewport').addEventListener('pointerdown', (event) => {
  if (event.target.closest('button') || event.button !== 0) return;
  state.pan = { id: event.pointerId, x: event.clientX, y: event.clientY, start: { ...state.transform } };
  $('viewport').setPointerCapture(event.pointerId);
  $('viewport').classList.add('panning');
});
$('viewport').addEventListener('pointermove', (event) => {
  if (!state.pan || event.pointerId !== state.pan.id) return;
  state.transform.x = state.pan.start.x + event.clientX - state.pan.x;
  state.transform.y = state.pan.start.y + event.clientY - state.pan.y;
  transform();
});
for (const name of ['pointerup', 'pointercancel', 'lostpointercapture'])
  $('viewport').addEventListener(name, () => {
    state.pan = null;
    $('viewport').classList.remove('panning');
  });
$('viewport').addEventListener(
  'wheel',
  (event) => {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) zoom(Math.exp(-event.deltaY * 0.01), { x: event.clientX, y: event.clientY });
    else {
      state.transform.x -= event.deltaX;
      state.transform.y -= event.deltaY;
      transform();
    }
  },
  { passive: false },
);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    state.selected ? navigate(state.graph.id) : closeInspector();
    setSidebar(false);
  }
  if (event.target instanceof HTMLInputElement || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key === '/') {
    event.preventDefault();
    if (innerWidth < 900) setSidebar(true);
    $('search').focus();
  }
  if (event.target === document.body || event.target === $('viewport')) {
    if (event.key === '+' || event.key === '=') zoom(1.2);
    if (event.key === '-') zoom(1 / 1.2);
    if (event.key === '0') fit(true);
  }
});
window.addEventListener('hashchange', route);
narrowScreen.addEventListener('change', () => setSidebar(false));
setSidebar(false);
new ResizeObserver(() => fit()).observe($('viewport'));
$('retry').addEventListener('click', () => location.reload());
try {
  const response = await fetch(new URL('./graph.json', import.meta.url));
  if (!response.ok) throw new Error(`Graph export returned HTTP ${response.status}`);
  state.model = await response.json();
  if (state.model.version !== 1 || !state.model.graphs.some((g) => g.id === state.model.entry))
    throw new Error('Unsupported or incomplete graph export. Rebuild the Pages artifact.');
  $('project-name').textContent = state.model.title;
  document.title = `${state.model.title} · Entropy`;
  $('graph-count').textContent = state.model.graphs.length;
  for (const [label, count] of [
    ['Graphs', state.model.graphs.length],
    ['Native elements', state.model.elements.filter((e) => e.kind === 'native').length],
    ['Schema', state.model.elements.filter((e) => e.kind === 'schema').length],
  ]) {
    const metric = el('div', 'metric');
    metric.append(el('strong', '', count), el('span', '', label));
    $('metrics').append(metric);
  }
  for (const element of state.model.elements) if (element.kind === 'native') state.collapsed.add(element.module);
  $('revision').textContent = state.model.revision
    ? `Revision ${state.model.revision.slice(0, 7)} · JS`
    : 'Local build · JS';
  route();
} catch (error) {
  $('error-message').textContent = error.message;
  $('load-error').hidden = false;
}
