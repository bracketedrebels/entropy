///|
priv enum DefinitionBody {
  Native(Scheme, String)
  Schema(Type, Json)
  Graph(Array[Expr])
}

///|
priv struct Definition {
  name : String
  module_ : String
  role : String
  js : String
  at : Position
  body : DefinitionBody
}

///|
priv struct Compiled {
  scheme : Scheme
  definition : Definition
  parameters : Array[String]
  nodes : Array[(String, Typed)]
  output : Typed?
}

///|
priv struct Compiler {
  inference : Inference
  definitions : Map[String, Definition]
  order : Array[String]
  compiled : Map[String, Compiled]
  visiting : Map[String, Bool]
  schemas : Map[String, Json]
  mut entry : String?
}

///|
priv struct Scope {
  definition : Definition
  values : Map[String, Typed]
  expressions : Map[String, Expr]
  names : Array[String]
  visiting : Map[String, Bool]
  nodes : Array[(String, Typed)]
  json_types : Array[Type]
}

///|
fn Compiler::load_types(
  self : Compiler,
  file : String,
  text : String,
) -> Unit raise {
  for module_ in parse(file, text) {
    let items = module_.list()
    if items.length() < 2 {
      diagnostic(module_.at, "expected module")
    }
    for item in items[2:] {
      let xs = item.list()
      if !xs.is_empty() && xs[0].atom() == "native-type" {
        arity(xs, 3, item.at)
        let name = xs[1].atom()
        valid_name(name, xs[1].at)
        if self.inference.constructor_arity(name) is Some(_) {
          diagnostic(item.at, "duplicate native type: \{name}")
        }
        let variables : Map[String, Bool] = Map([])
        for parameter in xs[2].list() {
          let name = parameter.atom()
          if variables.contains(name) {
            diagnostic(parameter.at, "duplicate type parameter")
          }
          variables[name] = true
        }
        self.inference.constructors[name] = variables.length()
      }
    }
  }
}

///|
fn valid_name(name : String, at : Position) -> Unit raise CompileError {
  if name == "true" || name == "false" || name == "unit" {
    diagnostic(at, "name shadows a literal: \{name}")
  }
  if name.is_empty() || name.contains(".") {
    diagnostic(at, "local names must be nonempty and cannot contain '.'")
  }
  for ch in name.to_array() {
    if !(ch >= 'a' && ch <= 'z') &&
      !(ch >= 'A' && ch <= 'Z') &&
      !(ch >= '0' && ch <= '9') &&
      ch != '_' &&
      ch != '-' {
      diagnostic(at, "invalid name: \{name}")
    }
  }
}

///|
fn Compiler::load(self : Compiler, file : String, text : String) -> Unit raise {
  let forms = parse(file, text)
  if forms.length() != 1 {
    raise CompileError("\{file}: expected exactly one module")
  }
  let root = forms[0]
  let module_form = root.list()
  if module_form.length() < 2 || module_form[0].atom() != "module" {
    diagnostic(root.at, "expected (module name ...)")
  }
  let module_name = module_form[1].atom()
  valid_name(module_name, module_form[1].at)
  for item in module_form[2:] {
    let xs = item.list()
    if xs.is_empty() {
      diagnostic(item.at, "empty module declaration")
    }
    let kind = xs[0].atom()
    if kind == "native-type" {
      continue
    }
    if kind == "entry" {
      arity(xs, 2, item.at)
      if self.entry is Some(_) {
        diagnostic(item.at, "multiple entry graphs")
      }
      let name = xs[1].atom()
      self.entry = Some(
        if name.contains(".") {
          name
        } else {
          "\{module_name}.\{name}"
        },
      )
      continue
    }
    let (name, role, body) = if kind == "native" {
      arity(xs, 5, item.at)
      let role = xs[1].atom()
      let name = xs[2].atom()
      let mut scheme = self.inference.read_scheme(xs[3])
      if !(scheme.body is Arrow(_, _)) {
        diagnostic(xs[3].at, "native element must have a function signature")
      }
      let platform = xs[4].list()
      arity(platform, 2, xs[4].at)
      if platform[0].atom() != "nodejs" {
        diagnostic(xs[4].at, "only the nodejs target is supported")
      }
      if platform[1].atom() == "json.encode" {
        guard scheme.body is Arrow([input], Con("JSON", [])) else {
          diagnostic(xs[3].at, "json.encode requires (fn (a) JSON)")
          abort("unreachable")
        }
        scheme = { ..scheme, json_types: [input], }
      }
      (
        name,
        role,
        Native(scheme, nodejs_native(platform[1].atom(), platform[1].at)),
      )
    } else if kind == "schema" {
      arity(xs, 3, item.at)
      let key = xs[2].text()
      let schema = required(self.schemas, key)
      (
        xs[1].atom(),
        "value",
        Schema(schema_type(schema, item.at, true), schema),
      )
    } else if kind == "graph" {
      if xs.length() < 5 {
        diagnostic(item.at, "expected graph role, name, inputs and output")
      }
      (xs[2].atom(), xs[1].atom(), Graph(xs[3:].to_owned()))
    } else {
      diagnostic(
        item.at,
        "unknown declaration: \{kind}; type annotations are allowed only in native signatures",
      )
      ("", "", Graph([]))
    }
    valid_name(name, item.at)
    if role != "function" &&
      role != "source" &&
      role != "sink" &&
      role != "value" {
      diagnostic(item.at, "unknown element role: \{role}")
    }
    let full_name = "\{module_name}.\{name}"
    if self.definitions.contains(full_name) {
      diagnostic(item.at, "duplicate element: \{full_name}")
    }
    let definition = {
      name: full_name,
      module_: module_name,
      role,
      body,
      js: "g\{self.order.length()}",
      at: item.at,
    }
    self.definitions[full_name] = definition
    self.order.push(full_name)
  }
}

///|
fn Compiler::global(
  self : Compiler,
  scope : Scope,
  name : String,
  at : Position,
  callee : Bool,
) -> Typed raise {
  let full_name = if name.contains(".") {
    name
  } else {
    "\{scope.definition.module_}.\{name}"
  }
  let value = self.compile_definition(full_name, at)
  let role = value.definition.role
  if role == "source" || role == "sink" {
    if !callee {
      diagnostic(
        at,
        "effectful element cannot be passed as a pure function: \{name}",
      )
    }
    if scope.definition.role == "function" ||
      (role == "sink" && scope.definition.role != "sink") {
      diagnostic(
        at,
        "\{scope.definition.role} graph cannot invoke \{role}: \{name}",
      )
    }
  }
  let (type_, requirements) = self.inference.instantiate(value.scheme)
  for t in requirements {
    scope.json_types.push(t)
  }
  { type_, operation: Reference(value.definition.js), }
}

///|
fn Compiler::node_value(
  self : Compiler,
  scope : Scope,
  name : String,
  at : Position,
) -> Typed raise {
  if scope.values.get(name) is Some(value) {
    return value
  }
  if scope.visiting.get(name) == Some(true) {
    diagnostic(at, "cycle in graph at node: \{name}")
  }
  let expr = match scope.expressions.get(name) {
    Some(expr) => expr
    None => {
      diagnostic(at, "unknown graph node: \{name}")
      Expr::{ form: Atom(""), at, }
    }
  }
  scope.visiting[name] = true
  let value = self.expression(scope, expr, false)
  let js = "n\{scope.nodes.length()}"
  scope.nodes.push((js, value))
  let reference = { type_: value.type_, operation: Reference(js), }
  scope.values[name] = reference
  scope.visiting[name] = false
  reference
}

///|
fn Compiler::expression(
  self : Compiler,
  scope : Scope,
  expr : Expr,
  callee : Bool,
) -> Typed raise {
  match expr.form {
    Text(s) => { type_: primitive("String"), operation: Literal(quote(s)), }
    Atom(name) => {
      if name == "true" || name == "false" {
        return { type_: primitive("Bool"), operation: Literal(name), }
      }
      if name == "unit" {
        return { type_: primitive("Unit"), operation: Literal("undefined"), }
      }
      if scope.values.contains(name) || scope.expressions.contains(name) {
        self.node_value(scope, name, expr.at)
      } else {
        self.global(scope, name, expr.at, callee)
      }
    }
    List(xs) => {
      if xs.is_empty() {
        diagnostic(expr.at, "empty expression")
      }
      let operator = xs[0].atom()
      if operator == "call" || operator == "partial" {
        if xs.length() < 2 {
          diagnostic(expr.at, "call requires a function")
        }
        let function = self.expression(scope, xs[1], operator == "call")
        let args : Array[Typed] = []
        for x in xs[2:] {
          args.push(self.expression(scope, x, false))
        }
        if operator == "partial" {
          guard self.inference.resolve(function.type_)
            is Arrow(parameters, result) else {
            diagnostic(expr.at, "partial needs a known function arity")
            abort("unreachable")
          }
          if args.is_empty() || args.length() >= parameters.length() {
            diagnostic(
              expr.at,
              "partial must bind at least one but not all inputs",
            )
          }
          for i = 0; i < args.length(); i = i + 1 {
            self.inference.unify(args[i].type_, parameters[i], expr.at)
          }
          {
            type_: Arrow(parameters[args.length():].to_owned(), result),
            operation: Partial(
              function,
              args,
              parameters.length() - args.length(),
            ),
          }
        } else {
          let result = self.inference.fresh()
          self.inference.unify(
            function.type_,
            Arrow(args.map(fn(x) { x.type_ }), result),
            expr.at,
          )
          { type_: result, operation: Apply(function, args), }
        }
      } else if operator == "tuple" {
        let fields : Array[(String, Typed)] = []
        let seen : Map[String, Bool] = Map([])
        for x in xs[1:] {
          let pair = x.list()
          arity(pair, 2, x.at)
          let name = pair[0].atom()
          if seen.contains(name) {
            diagnostic(x.at, "duplicate tuple field: \{name}")
          }
          seen[name] = true
          fields.push((name, self.expression(scope, pair[1], false)))
        }
        fields.sort_by(fn(a, b) { a.0[:].lexical_compare(b.0[:]) })
        {
          type_: Row(fields.map(fn(f) { (f.0, f.1.type_) }), RowEmpty),
          operation: Tuple(fields),
        }
      } else if operator == "field" {
        arity(xs, 3, expr.at)
        let value = self.expression(scope, xs[1], false)
        let name = xs[2].atom()
        let field_type = self.inference.fresh()
        let row = self.inference.fresh()
        self.inference.unify(
          value.type_,
          Row([(name, field_type)], row),
          expr.at,
        )
        { type_: field_type, operation: Field(value, name), }
      } else if operator == "vector" {
        let t = self.inference.fresh()
        let values : Array[Typed] = []
        for x in xs[1:] {
          let value = self.expression(scope, x, false)
          self.inference.unify(t, value.type_, x.at)
          values.push(value)
        }
        { type_: Con("Vector", [t]), operation: Vector(values), }
      } else {
        diagnostic(
          expr.at,
          "unknown graph expression: \{operator}; user type annotations and lambdas are not supported",
        )
        { type_: primitive("Unit"), operation: Literal("undefined"), }
      }
    }
  }
}

///|
fn Compiler::compile_definition(
  self : Compiler,
  name : String,
  at : Position,
) -> Compiled raise {
  if self.compiled.get(name) is Some(value) {
    return value
  }
  let definition = match self.definitions.get(name) {
    Some(value) => value
    None => {
      diagnostic(at, "unknown element: \{name}")
      abort("unreachable")
    }
  }
  if self.visiting.get(name) == Some(true) {
    diagnostic(at, "recursive graph is unsupported in M1: \{name}")
  }
  self.visiting[name] = true
  let compiled = match definition.body {
    Native(scheme, _) => {
      if scheme.body is Arrow(_, result) {
        if definition.role == "source" && !(result is Con("Stream", [_])) {
          diagnostic(definition.at, "native source must return Stream")
        }
        if definition.role == "sink" && !(result is Con("Unit", [])) {
          diagnostic(definition.at, "native sink must return Unit")
        }
      }
      { scheme, definition, parameters: [], nodes: [], output: None, }
    }
    Schema(type_, _) =>
      {
        scheme: { variables: [], body: Con("Schema", [type_]), json_types: [], },
        definition,
        parameters: [],
        nodes: [],
        output: None,
      }
    Graph(forms) => {
      let scope : Scope = {
        definition,
        values: Map([]),
        expressions: Map([]),
        names: [],
        visiting: Map([]),
        nodes: [],
        json_types: [],
      }
      let inputs = forms[0].list()
      if inputs.is_empty() || inputs[0].atom() != "inputs" {
        diagnostic(forms[0].at, "graph must start with (inputs ...)")
      }
      let parameters : Array[String] = []
      let types : Array[Type] = []
      for input in inputs[1:] {
        let name = input.atom()
        valid_name(name, input.at)
        if scope.values.contains(name) {
          diagnostic(input.at, "duplicate input: \{name}")
        }
        let type_ = self.inference.fresh()
        let js = "p\{parameters.length()}"
        parameters.push(js)
        types.push(type_)
        scope.values[name] = { type_, operation: Reference(js), }
      }
      let mut output : Expr? = None
      for form in forms[1:] {
        let xs = form.list()
        if xs.is_empty() {
          diagnostic(form.at, "empty graph declaration")
        }
        let kind = xs[0].atom()
        if kind == "node" {
          arity(xs, 3, form.at)
          let name = xs[1].atom()
          valid_name(name, xs[1].at)
          if scope.values.contains(name) || scope.expressions.contains(name) {
            diagnostic(form.at, "duplicate node or input: \{name}")
          }
          scope.expressions[name] = xs[2]
          scope.names.push(name)
        } else if kind == "output" {
          arity(xs, 2, form.at)
          if output is Some(_) {
            diagnostic(form.at, "a graph has exactly one output")
          }
          output = Some(xs[1])
        } else {
          diagnostic(
            form.at,
            "unknown graph declaration: \{kind}; type annotations are not allowed",
          )
        }
      }
      // Проверяем и неиспользованные узлы: ошибка не должна скрываться за
      // тем, что редактор ещё не соединил узел с выходом.
      for name in scope.names {
        ignore(self.node_value(scope, name, definition.at))
      }
      let out = match output {
        Some(expr) => self.expression(scope, expr, false)
        None => {
          diagnostic(definition.at, "graph needs one output")
          abort("unreachable")
        }
      }
      if definition.role == "source" {
        self.inference.unify(
          out.type_,
          Con("Stream", [self.inference.fresh()]),
          definition.at,
        )
      } else if definition.role == "sink" {
        self.inference.unify(out.type_, primitive("Unit"), definition.at)
      }
      // Графы не захватывают локальные переменные других графов. Поэтому
      // все свободные переменные его сигнатуры безопасно обобщаются.
      let requirements : Array[Type] = []
      for t in scope.json_types {
        if !self.inference.check_json(t, definition.at) {
          requirements.push(t)
        }
      }
      {
        scheme: self.inference.generalize(
          Arrow(types, out.type_),
          json_types=requirements,
        ),
        definition,
        parameters,
        nodes: scope.nodes,
        output: Some(out),
      }
    }
  }
  self.compiled[name] = compiled
  self.visiting[name] = false
  compiled
}

///|
/// Compile an in-memory project bundle into a Node.js module and inferred signatures.
/// No filesystem, networking, JavaScript FFI, or runtime dependencies in this API.
pub fn compile(bundle : Json) -> Json raise {
  let fields = json_object(bundle, "project bundle")
  let runtime_base = json_string(
    fields.get("runtimeBase").unwrap_or(Json::string("../runtime")),
    "runtimeBase",
  )
  if fields.get("target") != Some(Json::string("nodejs")) {
    raise CompileError("only target=nodejs is supported")
  }
  let schemas = json_object(required(fields, "schemas"), "schemas")
  let config = Json::object(
    json_object(fields.get("config").unwrap_or(Json::empty_object()), "config"),
  )
  let compiler : Compiler = {
    inference: { next: 0, substitutions: Map([]), constructors: Map([]), },
    definitions: Map([]),
    order: [],
    compiled: Map([]),
    visiting: Map([]),
    schemas,
    entry: None,
  }
  let sources = json_array(required(fields, "sources"), "sources")
  for source in sources {
    let source = json_object(source, "source")
    compiler.load_types(
      json_string(required(source, "name"), "source name"),
      json_string(required(source, "text"), "source text"),
    )
  }
  for source in sources {
    let source = json_object(source, "source")
    compiler.load(
      json_string(required(source, "name"), "source name"),
      json_string(required(source, "text"), "source text"),
    )
  }
  let entry = match compiler.entry {
    Some(entry) => entry
    None => raise CompileError("project requires one (entry ...) declaration")
  }
  let at = { file: "<entry>", line: 1, column: 1, }
  for name in compiler.order {
    ignore(compiler.compile_definition(name, at))
  }
  let main = compiler.compile_definition(entry, at)
  if main.definition.role != "sink" {
    diagnostic(main.definition.at, "entry must be a sink graph")
  }
  compiler.inference.unify(
    main.scheme.body,
    Arrow([], primitive("Unit")),
    main.definition.at,
  )
  for t in main.scheme.json_types {
    if !compiler.inference.check_json(t, main.definition.at) {
      diagnostic(main.definition.at, "ambiguous JSON encoding type at entry")
    }
  }
  let lines : Array[String] = [
    "// Generated by Entropy. Do not edit.",
    "import * as stdlib from \{quote(runtime_base + "/stdlib.mjs")};",
    "import * as http from \{quote(runtime_base + "/http.mjs")};",
    "export function createProgram(config = {}) {",
    "  const host = http.createHost({ ...\{config.stringify()}, ...config });",
  ]
  let signatures : Map[String, Json] = Map([])
  for name in compiler.order {
    let value = compiler.compile_definition(name, at)
    let definition = value.definition
    let constraints = if value.scheme.json_types.is_empty() {
      ""
    } else {
      " where JsonEncodable(\{value.scheme.json_types.map(fn(t) { compiler.inference.describe(t) }).join(", ")})"
    }
    signatures[name] = Json::string(
      compiler.inference.describe(value.scheme.body) + constraints,
    )
    match definition.body {
      Native(_, code) => lines.push("  const \{definition.js} = \{code};")
      Schema(_, schema) =>
        lines.push(
          "  const \{definition.js} = stdlib.validator(\{schema.stringify()});",
        )
      Graph(_) => {
        lines.push("  // \{definition.name}")
        lines.push(
          "  function \{definition.js}(\{value.parameters.join(", ")}) {",
        )
        for (name, expr) in value.nodes {
          lines.push("    const \{name} = \{emit(expr)};")
        }
        if value.output is Some(expr) {
          lines.push("    return \{emit(expr)};")
        }
        lines.push("  }")
      }
    }
  }
  let metadata = Json::object(signatures)
  lines.push(
    "  return host.program(() => \{main.definition.js}(), \{metadata.stringify()});",
  )
  lines.push("}")
  Json::object({
    "javascript": Json::string(lines.join("\n") + "\n"),
    "signatures": metadata,
  })
}
