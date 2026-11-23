///|
fn sample(name : String) -> Module {
  { name, import_: "", bindings: {}, intrinsics: None, program: None, }
}

///|
test "duplicate modules and native bindings are rejected" {
  assert_true(
    (Ok(assemble([sample("one"), sample("one")])) catch { e => Err(e) })
    is Err(_),
  )
  let binding : Binding = { expression: "value => value", json_input: false, }
  let one = { ..sample("one"), bindings: { "shared": binding }, }
  let two = { ..sample("two"), bindings: { "shared": binding }, }
  assert_true((Ok(assemble([one, two])) catch { e => Err(e) }) is Err(_))
}

///|
test "program and intrinsic ownership are unambiguous" {
  let intrinsic : Intrinsics = {
    tuple: "tuple",
    field: "field",
    validator: "validator",
  }
  let one = { ..sample("one"), intrinsics: Some(intrinsic), }
  let two = { ..sample("two"), intrinsics: Some(intrinsic), }
  assert_true((Ok(assemble([one, two])) catch { e => Err(e) }) is Err(_))
  let program : Program = {
    setup: fn(_) { "" },
    finish: fn(entry, _) { entry },
  }
  let a = { ..sample("a"), program: Some(program), }
  let b = { ..sample("b"), program: Some(program), }
  assert_true((Ok(assemble([a, b])) catch { e => Err(e) }) is Err(_))
  assert_true(
    (Ok(assemble([]).require_intrinsics()) catch { e => Err(e) }) is Err(_),
  )
}
