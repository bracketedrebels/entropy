///|
fn json_object(
  value : Json,
  context : String,
) -> Map[String, Json] raise CompileError {
  match value {
    Object(fields) => fields
    _ => raise CompileError("\{context}: expected JSON object")
  }
}

///|
fn json_string(value : Json, context : String) -> String raise CompileError {
  match value {
    String(s) => s
    _ => raise CompileError("\{context}: expected JSON string")
  }
}

///|
fn json_array(value : Json, context : String) -> Array[Json] raise CompileError {
  match value {
    Array(a) => a
    _ => raise CompileError("\{context}: expected JSON array")
  }
}

///|
fn required(
  fields : Map[String, Json],
  key : String,
) -> Json raise CompileError {
  match fields.get(key) {
    Some(v) => v
    None => raise CompileError("missing JSON property: \{key}")
  }
}

// M1 намеренно поддерживает проверяемое подмножество Draft 7: строки и
// закрытые объекты, где все поля обязательны. Незнакомые ключевые слова
// отклоняются, а не молча превращаются в заведомо слишком широкий тип.

///|
fn schema_type(
  value : Json,
  at : Position,
  root : Bool,
) -> Type raise CompileError {
  let fields = json_object(value, "schema")
  for key, _ in fields {
    if key != "$schema" &&
      key != "title" &&
      key != "description" &&
      key != "type" &&
      key != "properties" &&
      key != "required" &&
      key != "additionalProperties" {
      diagnostic(at, "unsupported Draft 7 keyword: \{key}")
    }
  }
  if root &&
    fields.get("$schema") !=
    Some(Json::string("http://json-schema.org/draft-07/schema#")) {
    diagnostic(
      at, "schema must declare http://json-schema.org/draft-07/schema#",
    )
  }
  if !root && fields.contains("$schema") {
    diagnostic(at, "nested $schema is unsupported")
  }
  for key in ["title", "description"] {
    if fields.get(key) is Some(v) {
      ignore(json_string(v, key))
    }
  }
  let name = json_string(required(fields, "type"), "schema type")
  if name == "string" {
    for key in ["properties", "required", "additionalProperties"] {
      if fields.contains(key) {
        diagnostic(at, "object keyword on string schema: \{key}")
      }
    }
    primitive("String")
  } else if name == "object" {
    if fields.get("additionalProperties") != Some(Json::boolean(false)) {
      diagnostic(at, "M1 object schemas require additionalProperties: false")
    }
    let properties = json_object(
      required(fields, "properties"),
      "schema properties",
    )
    let required_fields = json_array(
      required(fields, "required"),
      "schema required",
    )
    let names : Map[String, Bool] = Map([])
    for field in required_fields {
      let name = json_string(field, "required field")
      if names.contains(name) || !properties.contains(name) {
        diagnostic(at, "duplicate or unknown required field: \{name}")
      }
      names[name] = true
    }
    if names.length() != properties.length() {
      diagnostic(at, "M1 requires every object property to be required")
    }
    let keys = properties.keys().to_array()
    keys.sort_by(fn(a, b) { a[:].lexical_compare(b[:]) })
    let types : Array[(String, Type)] = []
    for key in keys {
      types.push((key, schema_type(required(properties, key), at, false)))
    }
    Row(types, RowEmpty)
  } else {
    diagnostic(at, "unsupported schema type in M1: \{name}")
    primitive("Unit")
  }
}
