// Оболочка получает JSON bundle одним аргументом и печатает JSON результат.
// Файловый ввод-вывод остаётся снаружи: ядро одинаково тестируется native/Wasm.

///|
fn main {
  let args = @env.args()
  try {
    if args.length() != 2 {
      raise @compiler.CompileError("usage: entropy '<project-bundle-json>'")
    }
    let result = @compiler.compile(@json.parse(args[1][:]))
    println(result.stringify())
  } catch {
    error => {
      println(
        Json::object({ "error": Json::string(error.to_string()) }).stringify(),
      )
      @env.exit(1)
    }
  }
}
