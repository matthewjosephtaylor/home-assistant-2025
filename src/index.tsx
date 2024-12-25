import ReactDOM from "react-dom/client";
import { App } from "./App";
(() => {
  console.log("Hello");
  try {
    ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
  } catch (e) {
    console.error(e);
  }
})();
