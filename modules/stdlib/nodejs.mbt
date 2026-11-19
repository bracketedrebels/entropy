// Сигнатуры, реализация JS и генератор принадлежат одному модулю.
// runtime_path уже разрешён файловым host относительно выходного JS-файла.

///|
pub fn nodejs(runtime_path : String) -> @nodejs.Module {
  let bindings : Map[String, @nodejs.Binding] = Map([])
  for
    (name, export_name) in [
      ("core.identity", "identity"),
      ("text.join", "join"),
      ("rx.map", "map"),
      ("rx.switchMap", "switchMap"),
      ("rx.of", "of"),
      ("result.fold", "fold"),
      ("json.validate", "validate"),
      ("json.encode", "encode"),
    ] {
    bindings[name] = {
      expression: "stdlib.\{export_name}",
      json_input: name == "json.encode",
    }
  }
  {
    name: "stdlib",
    import_: "import * as stdlib from \{Json::string(runtime_path).stringify()};",
    bindings,
    intrinsics: Some({
      tuple: "stdlib.tuple",
      field: "stdlib.field",
      validator: "stdlib.validator",
    }),
    program: None,
  }
}
