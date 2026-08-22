import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

// GitHub Pages 프로젝트 사이트는 /portfolio-2026/ 아래에 놓인다.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
