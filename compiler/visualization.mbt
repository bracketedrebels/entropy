// Экспортируем уже проверенный IR, а не повторно разбираем исходники в браузере.
// Локальные ссылки сохраняют идентичность узла: один результат может питать
// несколько входов. Экспорт не добавляет эффектов и не меняет JS backend.

///|
priv struct Visualizer {
  compiler : Compiler
  nodes : Array[Json]
  edges : Array[Json]
  locals : Map[String, String]
  globals : Map[String, Definition]
  mut next : Int32
}

///|
fn Visualizer::node(
  self : Visualizer,
  id : String,
  label : String,
  kind : String,
  role : String,
  type_ : Type,
  symbol : String?,
  native : Bool,
  value : String,
  inputs : Array[(String, Type)],
) -> Unit {
  self.nodes.push(
    Json::object({
      "id": Json::string(id),
      "label": Json::string(label),
      "kind": Json::string(kind),
      "role": Json::string(role),
      "type": Json::string(self.compiler.inference.describe(type_)),
      "symbol": match symbol {
        Some(s) => Json::string(s)
        None => Json::null()
      },
      "native": Json::boolean(native),
      "value": Json::string(value),
      "inputs": Json::array(
        inputs.map(fn(p) {
          Json::object({
            "name": Json::string(p.0),
            "type": Json::string(self.compiler.inference.describe(p.1)),
          })
        }),
      ),
    }),
  )
}

///|
fn Visualizer::edge(
  self : Visualizer,
  from : String,
  to : String,
  port : Int32,
  type_ : Type,
) -> Unit {
  let kind = match self.compiler.inference.resolve(type_) {
    Arrow(_, _) => "function"
    Con("Schema", _) => "config"
    _ => "data"
  }
  self.edges.push(
    Json::object({
      "id": Json::string("edge\{self.edges.length()}"),
      "from": Json::string(from),
      "to": Json::string(to),
      "port": Json::number(port.to_double()),
      "type": Json::string(self.compiler.inference.describe(type_)),
      "kind": Json::string(kind),
    }),
  )
}

///|
fn Visualizer::expression(
  self : Visualizer,
  value : Typed,
  label : String?,
) -> String {
  if value.operation is Reference(name) {
    if self.locals.get(name) is Some(id) {
      return id
    }
  }
  let id = "e\{self.next}"
  self.next += 1
  match value.operation {
    Literal(text) =>
      self.node(
        id,
        label.unwrap_or("constant"),
        "constant",
        "value",
        value.type_,
        None,
        false,
        text,
        [],
      )
    Reference(name) => {
      let definition = self.globals[name]
      let kind = match definition.body {
        Schema(_, _) => "schema"
        _ => "function-value"
      }
      self.node(
        id,
        label.unwrap_or(definition.name),
        kind,
        definition.role,
        value.type_,
        Some(definition.name),
        definition.body is Native(_, _),
        "",
        [],
      )
    }
    Apply(callee, args) | Partial(callee, args, _) => {
      let definition = match callee.operation {
        Reference(name) => self.globals.get(name)
        _ => None
      }
      let kind = match value.operation {
        Partial(_, _, _) => "partial"
        _ => "call"
      }
      let inputs : Array[(String, Type)] = []
      let children : Array[Typed] = []
      if definition is None {
        inputs.push(("function", callee.type_))
        children.push(callee)
      }
      for i = 0; i < args.length(); i = i + 1 {
        inputs.push(("arg\{i + 1}", args[i].type_))
        children.push(args[i])
      }
      let name = match definition {
        Some(d) => d.name
        None => "apply"
      }
      let role = match definition {
        Some(d) => d.role
        None => "function"
      }
      let native = match definition {
        Some(d) => d.body is Native(_, _)
        None => false
      }
      let symbol = match definition {
        Some(d) => Some(d.name)
        None => None
      }
      self.node(
        id,
        label.unwrap_or(name),
        kind,
        role,
        value.type_,
        symbol,
        native,
        "",
        inputs,
      )
      for i = 0; i < children.length(); i = i + 1 {
        let child = children[i]
        self.edge(self.expression(child, None), id, i, child.type_)
      }
    }
    Field(parent, name) => {
      self.node(
        id,
        label.unwrap_or(name),
        "field",
        "function",
        value.type_,
        None,
        false,
        name,
        [("value", parent.type_)],
      )
      self.edge(self.expression(parent, None), id, 0, parent.type_)
    }
    Tuple(fields) => {
      self.node(
        id,
        label.unwrap_or("tuple"),
        "tuple",
        "function",
        value.type_,
        None,
        false,
        "",
        fields.map(fn(f) { (f.0, f.1.type_) }),
      )
      for i = 0; i < fields.length(); i = i + 1 {
        let child = fields[i].1
        self.edge(self.expression(child, None), id, i, child.type_)
      }
    }
    Vector(values) => {
      let inputs : Array[(String, Type)] = []
      for i = 0; i < values.length(); i = i + 1 {
        inputs.push(("item\{i + 1}", values[i].type_))
      }
      self.node(
        id,
        label.unwrap_or("vector"),
        "vector",
        "function",
        value.type_,
        None,
        false,
        "",
        inputs,
      )
      for i = 0; i < values.length(); i = i + 1 {
        let child = values[i]
        self.edge(self.expression(child, None), id, i, child.type_)
      }
    }
  }
  id
}

///|
fn Compiler::visualization(
  self : Compiler,
  signatures : Json,
  sources : Array[Json],
) -> Json {
  let elements : Array[Json] = []
  let graphs : Array[Json] = []
  let globals : Map[String, Definition] = Map([])
  for name in self.order {
    let d = self.definitions[name]
    globals[d.js] = d
  }
  for name in self.order {
    let compiled = self.compiled[name]
    let d = compiled.definition
    let kind = match d.body {
      Native(_, _) => "native"
      Schema(_, _) => "schema"
      Graph(_) => "graph"
    }
    let schema = match d.body {
      Schema(_, s) => s
      _ => Json::null()
    }
    elements.push(
      Json::object({
        "id": Json::string(name),
        "module": Json::string(d.module_),
        "role": Json::string(d.role),
        "kind": Json::string(kind),
        "file": Json::string(d.at.file),
        "line": Json::number(d.at.line.to_double()),
        "type": Json::string(self.inference.describe(compiled.scheme.body)),
        "schema": schema,
      }),
    )
    if !(d.body is Graph(_)) {
      continue
    }
    let view : Visualizer = {
      compiler: self,
      nodes: [],
      edges: [],
      locals: Map([]),
      globals,
      next: 0,
    }
    if compiled.scheme.body is Arrow(types, _) {
      for i = 0; i < compiled.parameters.length(); i = i + 1 {
        let parameter = compiled.parameters[i]
        view.locals[parameter] = parameter
        view.node(
          parameter,
          compiled.labels[parameter],
          "input",
          "input",
          types[i],
          None,
          false,
          "",
          [],
        )
      }
    }
    for (local_id, value) in compiled.nodes {
      view.locals[local_id] = view.expression(
        value,
        compiled.labels.get(local_id),
      )
    }
    if compiled.output is Some(output) {
      let from = view.expression(output, None)
      view.node(
        "output",
        "output",
        "output",
        "output",
        output.type_,
        None,
        false,
        "",
        [("value", output.type_)],
      )
      view.edge(from, "output", 0, output.type_)
    }
    graphs.push(
      Json::object({
        "id": Json::string(name),
        "nodes": Json::array(view.nodes),
        "edges": Json::array(view.edges),
      }),
    )
  }
  Json::object({
    "version": Json::number(1),
    "target": Json::string("nodejs"),
    "entry": Json::string(self.entry.unwrap()),
    "signatures": signatures,
    "elements": Json::array(elements),
    "graphs": Json::array(graphs),
    "sources": Json::array(sources),
  })
}
