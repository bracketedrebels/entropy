// Каждый узел сохраняет позицию: ошибки вывода типов должны указывать на граф,
// а не на сгенерированный JavaScript. String.to_array даёт Unicode-символы.

///|
priv struct Position {
  file : String
  line : Int32
  column : Int32
}

///|
priv enum Form {
  Atom(String)
  Text(String)
  List(Array[Expr])
}

///|
priv struct Expr {
  form : Form
  at : Position
}

///|
pub(all) suberror CompileError {
  CompileError(String)
}

///|
pub impl Show for CompileError with fn output(self, logger) {
  let CompileError(message) = self
  logger.write_string(message)
}

///|
pub extend CompileError with Show::{to_string, output}

///|
fn diagnostic(at : Position, message : String) -> Unit raise CompileError {
  raise CompileError("\{at.file}:\{at.line}:\{at.column}: \{message}")
}

///|
priv struct Reader {
  chars : Array[Char]
  file : String
  mut offset : Int32
  mut line : Int32
  mut column : Int32
}

///|
fn Reader::take(self : Reader) -> Char {
  let ch = self.chars[self.offset]
  self.offset += 1
  if ch == '\n' {
    self.line += 1
    self.column = 1
  } else {
    self.column += 1
  }
  ch
}

///|
fn Reader::skip(self : Reader) -> Unit {
  while self.offset < self.chars.length() {
    let c = self.chars[self.offset]
    if c == ';' {
      while self.offset < self.chars.length() && self.chars[self.offset] != '\n' {
        ignore(self.take())
      }
    } else if c == ' ' || c == '\n' || c == '\r' || c == '\t' {
      ignore(self.take())
    } else {
      break
    }
  }
}

///|
fn Reader::read(self : Reader, depth : Int32) -> Expr raise {
  self.skip()
  let at = { file: self.file, line: self.line, column: self.column, }
  if depth > 256 {
    diagnostic(at, "s-expression nesting exceeds 256")
  }
  if self.offset >= self.chars.length() {
    diagnostic(at, "unexpected end of input")
  }
  let ch = self.take()
  let form = if ch == '(' {
    let children : Array[Expr] = []
    self.skip()
    while self.offset < self.chars.length() && self.chars[self.offset] != ')' {
      children.push(self.read(depth + 1))
      self.skip()
    }
    if self.offset >= self.chars.length() {
      diagnostic(at, "unclosed list")
    }
    ignore(self.take())
    List(children)
  } else if ch == ')' {
    diagnostic(at, "unexpected closing parenthesis")
    Atom("")
  } else if ch == '"' {
    let chars : Array[Char] = ['"']
    let mut escaped = false
    let mut closed = false
    while self.offset < self.chars.length() {
      let next = self.take()
      chars.push(next)
      if next == '"' && !escaped {
        closed = true
        break
      }
      escaped = next == '\\' && !escaped
    }
    if !closed {
      diagnostic(at, "unclosed string")
    }
    let raw = String::from_iter(chars.iter())
    let value = @json.parse(raw[:]) catch {
      error => {
        diagnostic(at, "invalid string: \{error}")
        Json::null()
      }
    }
    match value {
      String(s) => Text(s)
      _ => {
        diagnostic(at, "expected string")
        Text("")
      }
    }
  } else {
    let chars = [ch]
    while self.offset < self.chars.length() {
      let next = self.chars[self.offset]
      if next == '(' ||
        next == ')' ||
        next == ' ' ||
        next == '\n' ||
        next == '\r' ||
        next == '\t' ||
        next == ';' {
        break
      }
      chars.push(self.take())
    }
    Atom(String::from_iter(chars.iter()))
  }
  { form, at, }
}

///|
fn parse(file : String, text : String) -> Array[Expr] raise {
  let reader = { chars: text.to_array(), file, offset: 0, line: 1, column: 1, }
  let result : Array[Expr] = []
  reader.skip()
  while reader.offset < reader.chars.length() {
    result.push(reader.read(0))
    reader.skip()
  }
  result
}

///|
fn Expr::atom(self : Expr) -> String raise CompileError {
  match self.form {
    Atom(s) => s
    _ => {
      diagnostic(self.at, "expected a name")
      ""
    }
  }
}

///|
fn Expr::list(self : Expr) -> Array[Expr] raise CompileError {
  match self.form {
    List(xs) => xs
    _ => {
      diagnostic(self.at, "expected a list")
      []
    }
  }
}

///|
fn Expr::text(self : Expr) -> String raise CompileError {
  match self.form {
    Text(s) => s
    _ => {
      diagnostic(self.at, "expected a string")
      ""
    }
  }
}

///|
fn arity(xs : Array[Expr], n : Int32, at : Position) -> Unit raise CompileError {
  if xs.length() != n {
    diagnostic(at, "expected \{n} items, received \{xs.length()}")
  }
}

///|
fn quote(s : String) -> String {
  Json::string(s).stringify()
}
