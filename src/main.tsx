import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import "./styles/global.css";

// ★ AudioContext を window に載せる（これが重要）
;(window as any).audioCtx =
  new (window.AudioContext || (window as any).webkitAudioContext)();

window.addEventListener("click", () => {
  const ctx = (window as any).audioCtx;
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  console.log("AudioContext state:", ctx.state);
});

console.log("audioCtx created:", (window as any).audioCtx);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
