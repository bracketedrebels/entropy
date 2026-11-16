// Это реестр генераторов целевой платформы. Новая платформа добавляет
// генератор здесь, не меняя AST, унификацию или пользовательские графы.
// Динамическая загрузка плагинов MoonBit пока не входит в M1.

///|
fn nodejs_native(binding : String, at : Position) -> String raise CompileError {
  match binding {
    "http.requests" => "(() => host.requests)"
    "http.responses" => "(stream => host.responses(stream))"
    "http.readQuery" => "http.readQuery"
    "http.getPayload" => "http.getPayload"
    "http.makeResponse" => "http.makeResponse"
    "http.makeOk" => "http.makeOk"
    "http.makeBadRequest" => "http.makeBadRequest"
    "core.identity" => "stdlib.identity"
    "text.join" => "stdlib.join"
    "rx.map" => "stdlib.map"
    "rx.switchMap" => "stdlib.switchMap"
    "rx.of" => "stdlib.of"
    "result.fold" => "stdlib.fold"
    "json.validate" => "stdlib.validate"
    "json.encode" => "stdlib.encode"
    _ => {
      diagnostic(at, "unregistered nodejs native generator: \{binding}")
      ""
    }
  }
}

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
fn emit(expr : Typed) -> String {
  match expr.operation {
    Literal(s) | Reference(s) => s
    Apply(callee, args) => "\{emit(callee)}(\{args.map(emit).join(", ")})"
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
      "((f, \{captured.join(", ")}) => (\{rest.join(", ")}) => f(\{all}))(\{emit(callee)}, \{args.map(emit).join(", ")})"
    }
    Tuple(fields) => {
      let names = fields.map(fn(f) { quote(f.0) }).join(", ")
      let values = fields.map(fn(f) { emit(f.1) }).join(", ")
      "stdlib.tuple([\{names}], [\{values}])"
    }
    Vector(items) => "[\{items.map(emit).join(", ")}]"
    Field(value, name) => "stdlib.field(\{emit(value)}, \{quote(name)})"
  }
}
