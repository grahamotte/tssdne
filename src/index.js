import "./index.css";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import store from "./store";

window.onresize = (event) => store.resize();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
