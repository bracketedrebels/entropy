// Контракт между компилятором и нативными модулями. Здесь нет знаний о HTTP,
// RxJS или именах пакетов. Модули поставляют MoonBit-генераторы и их возможности.

///|
pub(all) struct Binding {
  expression : String
  json_input : Bool
}

///|
pub(all) struct Intrinsics {
  tuple : String
  field : String
  validator : String
}

///|
pub(all) struct Program {
  setup : (Json) -> String
  finish : (String, Json) -> String
}

///|
pub(all) struct Module {
  name : String
  import_ : String
  bindings : Map[String, Binding]
  intrinsics : Intrinsics?
  program : Program?
}

///|
pub(all) struct Backend {
  imports : Array[String]
  bindings : Map[String, Binding]
  intrinsics : Intrinsics?
  program : Program?
}

///|
pub(all) suberror BackendError {
  BackendError(String)
}

///|
pub impl Show for BackendError with fn output(self, logger) {
  let BackendError(message) = self
  logger.write_string(message)
}

///|
pub fn assemble(modules : Array[Module]) -> Backend raise BackendError {
  let imports : Array[String] = []
  let bindings : Map[String, Binding] = Map([])
  let names : Map[String, Bool] = Map([])
  let mut intrinsics = None
  let mut program = None
  for module_ in modules {
    if names.contains(module_.name) {
      raise BackendError("duplicate nodejs module: \{module_.name}")
    }
    names[module_.name] = true
    imports.push(module_.import_)
    for name, binding in module_.bindings {
      if bindings.contains(name) {
        raise BackendError("duplicate native binding: \{name}")
      }
      bindings[name] = binding
    }
    if module_.intrinsics is Some(value) {
      if intrinsics is Some(_) {
        raise BackendError("multiple nodejs intrinsic providers")
      }
      intrinsics = Some(value)
    }
    if module_.program is Some(value) {
      if program is Some(_) {
        raise BackendError("multiple nodejs program hosts")
      }
      program = Some(value)
    }
  }
  { imports, bindings, intrinsics, program, }
}

///|
pub fn Backend::require_intrinsics(
  self : Backend,
) -> Intrinsics raise BackendError {
  match self.intrinsics {
    Some(value) => value
    None =>
      raise BackendError(
        "nodejs target requires an intrinsic provider for tuples and schemas",
      )
  }
}

///|
pub extend BackendError with Show::{to_string, output}
