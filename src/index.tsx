import * as React from "react";
import * as ReactDOM from "react-dom";
import "threads/register";

import { App } from "./App";

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);
