// Точка статической линковки CLI. Реализация и метаданные каждого генератора
// находятся внутри его модуля; ядро компилятора не импортирует этот каталог.
// Новому модулю пока нужны импорт MoonBit и одна регистрация здесь.

///|
pub fn nodejs(bundle : Json) -> @nodejs.Backend raise {
  guard bundle is Object(fields) else {
    raise @nodejs.BackendError("expected project bundle")
  }
  let descriptions = match fields.get("nativeModules") {
    Some(Array(items)) => items
    None => []
    _ => raise @nodejs.BackendError("nativeModules must be an array")
  }
  let modules : Array[@nodejs.Module] = []
  for description in descriptions {
    guard description is Object(item) else {
      raise @nodejs.BackendError("expected native module descriptor")
    }
    guard item.get("generator") is Some(String(generator)) else {
      raise @nodejs.BackendError("module requires a nodejs generator")
    }
    guard item.get("runtime") is Some(String(runtime)) else {
      raise @nodejs.BackendError("module requires a nodejs runtime path")
    }
    modules.push(
      match generator {
        "stdlib" => @stdlib.nodejs(runtime)
        "http" => @http.nodejs(runtime)
        _ =>
          raise @nodejs.BackendError(
            "unregistered nodejs module generator: \{generator}",
          )
      },
    )
  }
  @nodejs.assemble(modules)
}
