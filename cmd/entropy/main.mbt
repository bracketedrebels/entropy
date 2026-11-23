// Оболочка получает JSON bundle одним аргументом и печатает JSON результат.
// Файловый ввод-вывод остаётся снаружи: ядро одинаково тестируется native/Wasm.

///|
fn main {
  let args = @env.args()
  try {
    if args.length() != 2 {
      raise @compiler.CompileError("usage: entropy '<project-bundle-json>'")
    }
    let bundle = @json.parse(args[1][:])
    let result = @compiler.compile(bundle, @modules.nodejs(bundle))
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
