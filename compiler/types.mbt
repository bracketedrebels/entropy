// Type — внутренний язык компилятора, не синтаксис пользовательского графа.
// RowEmpty закрывает кортеж; Var в хвосте разрешает дополнительные поля.

///|
priv enum Type {
  Var(Int32)
  Con(String, Array[Type])
  Arrow(Array[Type], Type)
  Row(Array[(String, Type)], Type)
  RowEmpty
}

///|
priv struct Scheme {
  variables : Array[Int32]
  body : Type
  json_types : Array[Type]
}

///|
priv struct Inference {
  mut next : Int32
  substitutions : Map[Int32, Type]
  constructors : Map[String, Int32]
}

///|
fn Inference::fresh(self : Inference) -> Type {
  let id = self.next
  self.next += 1
  Var(id)
}

///|
fn Inference::resolve(self : Inference, t : Type) -> Type {
  match t {
    Var(id) =>
      match self.substitutions.get(id) {
        Some(value) => {
          let resolved = self.resolve(value)
          self.substitutions[id] = resolved
          resolved
        }
        None => t
      }
    _ => t
  }
}

///|
fn Inference::occurs(self : Inference, id : Int32, t : Type) -> Bool {
  match self.resolve(t) {
    Var(other) => id == other
    Con(_, args) => args.any(fn(t) { self.occurs(id, t) })
    Arrow(args, result) =>
      self.occurs(id, result) || args.any(fn(t) { self.occurs(id, t) })
    Row(fields, tail) =>
      self.occurs(id, tail) || fields.any(fn(f) { self.occurs(id, f.1) })
    RowEmpty => false
  }
}

///|
fn Inference::bind(
  self : Inference,
  id : Int32,
  t : Type,
  at : Position,
) -> Unit raise CompileError {
  match self.resolve(t) {
    Var(other) if other == id => ()
    other => {
      if self.occurs(id, other) {
        diagnostic(at, "infinite type (occurs check)")
      }
      self.substitutions[id] = other
    }
  }
}

///|
fn Inference::flatten_row(
  self : Inference,
  t : Type,
) -> (Array[(String, Type)], Type) {
  match self.resolve(t) {
    Row(fields, tail) => {
      let (more, rest) = self.flatten_row(tail)
      (fields + more, rest)
    }
    other => ([], other)
  }
}

///|
fn find_field(fields : Array[(String, Type)], name : String) -> Type? {
  for field in fields {
    if field.0 == name {
      return Some(field.1)
    }
  }
  None
}

// Унификация строк сохраняет связь между несколькими проекциями одного
// аргумента. get(first) и get(last) выводят один кортеж с двумя полями.

///|
fn Inference::unify_rows(
  self : Inference,
  a : Type,
  b : Type,
  at : Position,
) -> Unit raise CompileError {
  let (af, ar) = self.flatten_row(a)
  let (bf, br) = self.flatten_row(b)
  let left : Array[(String, Type)] = []
  let right : Array[(String, Type)] = []
  for (name, t) in af {
    match find_field(bf, name) {
      Some(other) => self.unify(t, other, at)
      None => left.push((name, t))
    }
  }
  for field in bf {
    if find_field(af, field.0) is None {
      right.push(field)
    }
  }
  if left.is_empty() && right.is_empty() {
    self.unify(ar, br, at)
    return
  }
  if (ar is RowEmpty && !right.is_empty()) ||
    (br is RowEmpty && !left.is_empty()) {
    diagnostic(
      at,
      "tuple fields differ: \{self.describe(a)} versus \{self.describe(b)}",
    )
  }
  let tail = self.fresh()
  self.unify(ar, if right.is_empty() { tail } else { Row(right, tail) }, at)
  self.unify(br, if left.is_empty() { tail } else { Row(left, tail) }, at)
}

///|
fn Inference::unify(
  self : Inference,
  a : Type,
  b : Type,
  at : Position,
) -> Unit raise CompileError {
  let a = self.resolve(a)
  let b = self.resolve(b)
  match (a, b) {
    (Var(id), other) | (other, Var(id)) => self.bind(id, other, at)
    (Con(an, aa), Con(bn, ba)) if an == bn && aa.length() == ba.length() =>
      for i = 0; i < aa.length(); i = i + 1 {
        self.unify(aa[i], ba[i], at)
      }
    (Arrow(aa, ar), Arrow(ba, br)) if aa.length() == ba.length() => {
      for i = 0; i < aa.length(); i = i + 1 {
        self.unify(aa[i], ba[i], at)
      }
      self.unify(ar, br, at)
    }
    (RowEmpty, RowEmpty) => ()
    (Row(_, _), Row(_, _)) | (Row(_, _), RowEmpty) | (RowEmpty, Row(_, _)) =>
      self.unify_rows(a, b, at)
    _ =>
      diagnostic(
        at,
        "type mismatch: \{self.describe(a)} versus \{self.describe(b)}",
      )
  }
}

///|
fn Inference::free(self : Inference, t : Type, ids : Map[Int32, Bool]) -> Unit {
  match self.resolve(t) {
    Var(id) => ids[id] = true
    Con(_, args) =>
      for a in args {
        self.free(a, ids)
      }
    Arrow(args, result) => {
      for a in args {
        self.free(a, ids)
      }
      self.free(result, ids)
    }
    Row(fields, tail) => {
      for (_, t) in fields {
        self.free(t, ids)
      }
      self.free(tail, ids)
    }
    RowEmpty => ()
  }
}

///|
fn Inference::generalize(
  self : Inference,
  t : Type,
  json_types~ : Array[Type] = [],
) -> Scheme {
  let free : Map[Int32, Bool] = Map([])
  self.free(t, free)
  for t in json_types {
    self.free(t, free)
  }
  let variables = free.keys().to_array()
  variables.sort()
  { variables, body: t, json_types, }
}

///|
fn Inference::replace(
  self : Inference,
  t : Type,
  replacements : Map[Int32, Type],
) -> Type {
  match self.resolve(t) {
    Var(id) => replacements.get(id).unwrap_or(Var(id))
    Con(name, args) =>
      Con(name, args.map(fn(t) { self.replace(t, replacements) }))
    Arrow(args, result) =>
      Arrow(
        args.map(fn(t) { self.replace(t, replacements) }),
        self.replace(result, replacements),
      )
    Row(fields, tail) =>
      Row(
        fields.map(fn(f) { (f.0, self.replace(f.1, replacements)) }),
        self.replace(tail, replacements),
      )
    RowEmpty => RowEmpty
  }
}

///|
fn Inference::instantiate(
  self : Inference,
  scheme : Scheme,
) -> (Type, Array[Type]) {
  let replacements : Map[Int32, Type] = Map([])
  for id in scheme.variables {
    replacements[id] = self.fresh()
  }
  (
    self.replace(scheme.body, replacements),
    scheme.json_types.map(fn(t) { self.replace(t, replacements) }),
  )
}

///|
fn Inference::describe(self : Inference, t : Type) -> String {
  match self.resolve(t) {
    Var(id) => "'t\{id}"
    Con(name, args) =>
      if args.is_empty() {
        name
      } else {
        "(\{name} \{args.map(fn(t) { self.describe(t) }).join(" ")})"
      }
    Arrow(args, result) =>
      "(fn (\{args.map(fn(t) { self.describe(t) }).join(" ")}) \{self.describe(result)})"
    Row(_, _) => {
      let (fields, tail) = self.flatten_row(t)
      fields.sort_by(fn(a, b) { a.0[:].lexical_compare(b.0[:]) })
      let text = fields
        .map(fn(f) { "(\{f.0} \{self.describe(f.1)})" })
        .join(" ")
      let suffix = if tail is RowEmpty {
        ""
      } else {
        " | \{self.describe(tail)}"
      }
      "(tuple \{text}\{suffix})"
    }
    RowEmpty => "(tuple)"
  }
}

///|
fn primitive(name : String) -> Type {
  Con(name, [])
}

///|
fn Inference::constructor_arity(self : Inference, name : String) -> Int32? {
  match name {
    "Unit" | "Bool" | "String" | "Int32" | "Int64" | "Float32" | "Float64" =>
      Some(0)
    "Vector" => Some(1)
    _ => self.constructors.get(name)
  }
}

///|
fn Inference::read_type(
  self : Inference,
  expr : Expr,
  vars : Map[String, Type],
) -> Type raise CompileError {
  match expr.form {
    Atom(name) =>
      match vars.get(name) {
        Some(t) => t
        None => {
          if self.constructor_arity(name) != Some(0) {
            diagnostic(expr.at, "unknown or unapplied native type: \{name}")
          }
          primitive(name)
        }
      }
    List(xs) => {
      if xs.is_empty() {
        diagnostic(expr.at, "empty type")
      }
      let name = xs[0].atom()
      if name == "fn" {
        arity(xs, 3, expr.at)
        Arrow(
          xs[1].list().map(fn(x) raise CompileError { self.read_type(x, vars) }),
          self.read_type(xs[2], vars),
        )
      } else if name == "tuple" {
        let fields : Array[(String, Type)] = []
        for field in xs[1:] {
          let pair = field.list()
          arity(pair, 2, field.at)
          let name = pair[0].atom()
          if find_field(fields, name) is Some(_) {
            diagnostic(field.at, "duplicate tuple field: \{name}")
          }
          fields.push((name, self.read_type(pair[1], vars)))
        }
        Row(fields, RowEmpty)
      } else {
        let args = xs[1:].to_owned()
        if self.constructor_arity(name) != Some(args.length()) {
          diagnostic(
            expr.at,
            "unknown type constructor or wrong arity: \{name}",
          )
        }
        Con(
          name,
          args.map(fn(x) raise CompileError { self.read_type(x, vars) }),
        )
      }
    }
    _ => {
      diagnostic(expr.at, "types are names or applications")
      primitive("Unit")
    }
  }
}

///|
fn Inference::read_scheme(
  self : Inference,
  expr : Expr,
) -> Scheme raise CompileError {
  let vars : Map[String, Type] = Map([])
  let body = match expr.form {
    List(xs) if !xs.is_empty() && xs[0].atom() == "forall" => {
      arity(xs, 3, expr.at)
      for v in xs[1].list() {
        let name = v.atom()
        if vars.contains(name) {
          diagnostic(v.at, "duplicate type variable: \{name}")
        }
        if self.constructor_arity(name) is Some(_) {
          diagnostic(v.at, "type variable shadows constructor")
        }
        vars[name] = self.fresh()
      }
      self.read_type(xs[2], vars)
    }
    _ => self.read_type(expr, vars)
  }
  self.generalize(body)
}

// Неявное ограничение кодека следует за generic-параметром через графы.
// Например, encode(identity(x)) нельзя применить к функции или Stream.

///|
fn Inference::check_json(
  self : Inference,
  t : Type,
  at : Position,
) -> Bool raise CompileError {
  match self.resolve(t) {
    Var(_) => false
    Con("String", []) | Con("Bool", []) | Con("JSON", []) | Con("Int32", []) =>
      true
    Con("Vector", [item]) => self.check_json(item, at)
    Row(_, _) => {
      let (fields, tail) = self.flatten_row(t)
      let mut closed = tail is RowEmpty
      for (_, t) in fields {
        if !self.check_json(t, at) {
          closed = false
        }
      }
      closed
    }
    RowEmpty => true
    _ => {
      diagnostic(at, "type is not JSON encodable: \{self.describe(t)}")
      false
    }
  }
}
