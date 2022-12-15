import "./styles.scss";

// eslint-disable-next-line
import * as bootstrap from "bootstrap";

import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
