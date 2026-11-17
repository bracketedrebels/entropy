///|
priv enum Operation {
  Literal(String)
  Reference(String)
  Apply(Typed, Array[Typed])
  Partial(Typed, Array[Typed], Int32)
  Tuple(Array[(String, Typed)])
  Vector(Array[Typed])
  Field(Typed, String)
}

// Typed — минимальное типизированное промежуточное представление.
// JS строится только после успешного вывода типов всего приложения.

///|
priv struct Typed {
  type_ : Type
  operation : Operation
}

///|
fn emit(expr : Typed, backend : @nodejs.Backend) -> String raise {
  match expr.operation {
    Literal(s) | Reference(s) => s
    Apply(callee, args) =>
      "\{emit(callee, backend)}(\{args.map(fn(value) raise { emit(value, backend) }).join(", ")})"
    Partial(callee, args, remaining) => {
      let captured : Array[String] = []
      let rest : Array[String] = []
      for i = 0; i < args.length(); i = i + 1 {
        captured.push("a\{i}")
      }
      for i = 0; i < remaining; i = i + 1 {
        rest.push("r\{i}")
      }
      let all = (captured + rest).join(", ")
      "((f, \{captured.join(", ")}) => (\{rest.join(", ")}) => f(\{all}))(\{emit(callee, backend)}, \{args.map(fn(value) raise { emit(value, backend) }).join(", ")})"
    }
    Tuple(fields) => {
      let names = fields.map(fn(f) { quote(f.0) }).join(", ")
      let values = fields.map(fn(f) raise { emit(f.1, backend) }).join(", ")
      "\{backend.require_intrinsics().tuple}([\{names}], [\{values}])"
    }
    Vector(items) =>
      "[\{items.map(fn(value) raise { emit(value, backend) }).join(", ")}]"
    Field(value, name) =>
      "\{backend.require_intrinsics().field}(\{emit(value, backend)}, \{quote(name)})"
  }
}
