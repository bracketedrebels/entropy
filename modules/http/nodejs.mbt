// Владение HTTP host — решение модуля, а не семантика компилятора.
// Эти функции генерируют JS; запросы никогда не исполняются в MoonBit.

///|
pub fn nodejs(runtime_path : String) -> @nodejs.Module {
  let bindings : Map[String, @nodejs.Binding] = Map([])
  bindings["http.requests"] = {
    expression: "(() => host.requests)",
    json_input: false,
  }
  bindings["http.responses"] = {
    expression: "(stream => host.responses(stream))",
    json_input: false,
  }
  for
    export_name in [
      "readQuery", "getPayload", "makeResponse", "makeOk", "makeBadRequest",
    ] {
    bindings["http.\{export_name}"] = {
      expression: "http.\{export_name}",
      json_input: false,
    }
  }
  {
    name: "http",
    import_: "import * as http from \{Json::string(runtime_path).stringify()};",
    bindings,
    intrinsics: None,
    program: Some({
      setup: fn(config) {
        "  const host = http.createHost({ ...\{config.stringify()}, ...config });"
      },
      finish: fn(entry, signatures) {
        "host.program(() => \{entry}(), \{signatures.stringify()})"
      },
    }),
  }
}
