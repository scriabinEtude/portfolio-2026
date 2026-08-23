import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const base = "/portfolio-2026/";

// dev 서버에서 끝 슬래시 없는 주소(/portfolio-2026)나 루트(/)로 들어와도 base로 보내준다.
// 배포처인 GitHub Pages는 이 리다이렉트를 알아서 해주므로 dev에서만 적용한다.
function redirectToBase(): Plugin {
  const bare = base.slice(0, -1);
  return {
    name: "redirect-to-base",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [path, query] = (req.url ?? "/").split("?");
        if (path !== "/" && path !== bare) return next();
        res.writeHead(302, { Location: base + (query ? `?${query}` : "") });
        res.end();
      });
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), redirectToBase()],
});
