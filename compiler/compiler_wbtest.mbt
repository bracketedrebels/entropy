// Core-тесты явно подключают только stdlib. HTTP не является зависимостью ядра.

///|
fn compile_test(bundle : Json) -> Json raise {
  compile(bundle, @nodejs.assemble([@stdlib.nodejs("./stdlib.mjs")]))
}

///|
fn test_bundle(source : String) -> Json {
  Json::object({
    "target": Json::string("nodejs"),
    "sources": Json::array([
      Json::object({
        "name": Json::string("test.ent"),
        "text": Json::string(source),
      }),
    ]),
    "schemas": Json::empty_object(),
  })
}

///|
fn expect_error(source : String, fragment : String) -> Unit raise {
  match (Ok(compile_test(test_bundle(source))) catch { error => Err(error) }) {
    Ok(_) => fail("expected compilation to fail: \{fragment}")
    Err(error) =>
      assert_true(error.to_string().contains(fragment), msg=error.to_string())
  }
}

///|
fn signature(output : Json, name : String) -> String raise {
  let result = json_object(output, "result")
  json_string(
    required(json_object(required(result, "signatures"), "signatures"), name),
    "signature",
  )
}

///|
test "identity graph generalizes independently at each call" {
  let result = compile_test(
    test_bundle(
      (
        #| (module m
        #|   (graph function identity (inputs x) (output x))
        #|   (graph function strings (inputs) (output (call identity "hello")))
        #|   (graph function booleans (inputs) (output (call identity true)))
        #|   (graph sink main (inputs) (output unit))
        #|   (entry main))
      ),
    ),
  )
  assert_eq(signature(result, "m.strings"), "(fn () String)")
  assert_eq(signature(result, "m.booleans"), "(fn () Bool)")
  assert_true(signature(result, "m.identity").contains("'t"))
}

///|
test "generic native sources instantiate independently" {
  let result = compile_test(
    test_bundle(
      (
        #| (module m (native-type Stream (a))
        #|   (native source constant (forall (a) (fn (a) (Stream a))) (nodejs rx.of))
        #|   (graph source strings (inputs) (output (call constant "x")))
        #|   (graph source booleans (inputs) (output (call constant true)))
        #|   (graph sink main (inputs) (output unit)) (entry main))
      ),
    ),
  )
  assert_eq(signature(result, "m.strings"), "(fn () (Stream String))")
  assert_eq(signature(result, "m.booleans"), "(fn () (Stream Bool))")
}

///|
test "relationships between input ports are inferred" {
  let result = compile_test(
    test_bundle(
      (
        #| (module m
        #|   (graph function apply (inputs fn value) (output (call fn value)))
        #|   (graph function identity (inputs x) (output x))
        #|   (graph function use (inputs) (output (call apply identity "Dan")))
        #|   (graph sink main (inputs) (output unit)) (entry main))
      ),
    ),
  )
  assert_eq(signature(result, "m.use"), "(fn () String)")
  expect_error(
    (
      #| (module m
      #|   (graph function same (inputs a b) (output (vector a b)))
      #|   (graph sink main (inputs)
      #|     (node bad (call same "text" true)) (output unit)) (entry main))
    ),
    "type mismatch",
  )
}

///|
test "partial application keeps the unbound generic input" {
  let result = compile_test(
    test_bundle(
      (
        #| (module m
        #|   (graph function pair (inputs a b) (output (tuple (first a) (second b))))
        #|   (graph function withName (inputs) (output (partial pair "Dan")))
        #|   (graph function use (inputs) (output (call (call withName) true)))
        #|   (graph sink main (inputs) (output unit)) (entry main))
      ),
    ),
  )
  let generic = signature(result, "m.withName")
  assert_true(generic.contains("first String"))
  assert_true(generic.contains("second 't"))
  let concrete = signature(result, "m.use")
  assert_true(concrete.contains("second Bool"))
}

///|
test "row constraints merge and accept additional fields" {
  let result = compile_test(
    test_bundle(
      (
        #| (module m
        #|   (graph function both (inputs x)
        #|     (output (vector (field x a) (field x b))))
        #|   (graph function use (inputs)
        #|     (output (call both (tuple (a "one") (b "two") (extra true)))))
        #|   (graph sink main (inputs) (output unit)) (entry main))
      ),
    ),
  )
  assert_eq(signature(result, "m.use"), "(fn () (Vector String))")
  expect_error(
    (
      #| (module m
      #|   (graph function get (inputs x) (output (field x missing)))
      #|   (graph sink main (inputs)
      #|     (node bad (call get (tuple (present "x")))) (output unit)) (entry main))
    ),
    "tuple fields differ",
  )
}

///|
test "occurs check rejects infinite functions" {
  expect_error(
    "(module m (graph function omega (inputs x) (output (call x x))) (graph sink main (inputs) (output unit)) (entry main))",
    "infinite type",
  )
}

///|
test "cycles are errors but forward DAG edges are allowed" {
  expect_error(
    "(module m (graph sink main (inputs) (node a b) (node b a) (output unit)) (entry main))",
    "cycle in graph",
  )
  expect_error(
    "(module m (graph function recursive (inputs x) (output (call recursive x))) (entry recursive))",
    "recursive graph",
  )
  let result = compile_test(
    test_bundle(
      "(module m (graph function forward (inputs) (node a b) (node b true) (output a)) (graph sink main (inputs) (output unit)) (entry main))",
    ),
  )
  assert_eq(signature(result, "m.forward"), "(fn () Bool)")
}

///|
test "user space forbids annotations and multiple outputs" {
  expect_error(
    "(module m (graph function f (inputs x) (type x String) (output x)) (entry f))",
    "type annotations are not allowed",
  )
  expect_error(
    "(module m (graph sink main (inputs) (output unit) (output unit)) (entry main))",
    "exactly one output",
  )
}

///|
test "source cannot be invoked inside a pure function or escape as a callback" {
  expect_error(
    (
      #| (module m (native-type Stream (a))
      #|   (native source event (forall (a) (fn (a) (Stream a))) (nodejs rx.of))
      #|   (graph function bad (inputs) (output (call event true))) (entry bad))
    ),
    "function graph cannot invoke source",
  )
  expect_error(
    (
      #| (module m (native-type Stream (a))
      #|   (native source event (forall (a) (fn (a) (Stream a))) (nodejs rx.of))
      #|   (graph function bad (inputs) (output event)) (entry bad))
    ),
    "cannot be passed as a pure function",
  )
}

///|
test "codec constraints propagate through generic helpers" {
  expect_error(
    (
      #| (module m (native-type JSON ())
      #|   (native function encode (forall (a) (fn (a) JSON)) (nodejs json.encode))
      #|   (graph function stringify (inputs x) (output (call encode x)))
      #|   (graph function identity (inputs x) (output x))
      #|   (graph sink main (inputs) (node bad (call stringify identity)) (output unit)) (entry main))
    ),
    "not JSON encodable",
  )
}

///|
test "schema rejects unsupported keywords instead of widening the type" {
  let at = { file: "schema.json", line: 1, column: 1, }
  let schema : Json = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "string",
    "minLength": 1,
  }
  match (Ok(schema_type(schema, at, true)) catch { error => Err(error) }) {
    Ok(_) => fail("minLength is outside the declared M1 subset")
    Err(CompileError(message)) =>
      assert_true(message.contains("unsupported Draft 7 keyword: minLength"))
  }
}

///|
test "diagnostics include source positions and reject malformed text" {
  expect_error(
    "(module m\n (graph sink main (inputs) (output unknown))\n (entry main))", "test.ent:2:36",
  )
  expect_error("(module m", "unclosed list")
  expect_error(
    "(module m (graph sink main (inputs) (output \"oops))", "unclosed string",
  )
}

///|
test "a graph without native modules has no implicit HTTP host" {
  let output = compile(
    test_bundle(
      "(module plain (graph sink main (inputs) (output unit)) (entry main))",
    ),
    @nodejs.assemble([]),
  )
  let js = json_string(
    required(json_object(output, "output"), "javascript"),
    "js",
  )
  assert_false(js.contains("http"))
  assert_false(js.contains("import "))
  assert_true(js.contains("run: () =>"))
}

///|
test "custom native bindings are injected without changing compiler registries" {
  let custom : @nodejs.Module = {
    name: "custom",
    import_: "",
    bindings: {
      "custom.echo": { expression: "(value => value)", json_input: false, },
    },
    intrinsics: None,
    program: None,
  }
  let output = compile(
    test_bundle(
      "(module custom (native function echo (forall (a) (fn (a) a)) (nodejs custom.echo)) (graph sink main (inputs) (node seen (call echo true)) (output unit)) (entry main))",
    ),
    @nodejs.assemble([custom]),
  )
  assert_eq(signature(output, "custom.main"), "(fn () Unit)")
}
