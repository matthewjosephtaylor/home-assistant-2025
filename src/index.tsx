import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Errors } from "@mjt-engine/message";
(() => {
  try {
    window.addEventListener("unhandledrejection", async (event) => {
      console.log(await Errors.errorToTextAsync(event.reason));
    });

    ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
  } catch (e) {
    console.error(e);
  }
})();
