import { opine } from "./deps.ts";
import { defaultConfig, loadConfig } from "./config.ts";
import { createRouter } from "./router.ts";

const main = async () => {
  const config = await loadConfig();
  const port = config.server?.port ?? defaultConfig.server.port;
  const hostname = config.server?.host ?? defaultConfig.server.host;
  const mapping = config.mapping ?? defaultConfig.mapping;

  const app = opine();
  app.use(createRouter(mapping));
  const server = app.listen({ port, hostname });
  for (const addr of server.addrs) {
    if (addr.transport === "tcp") {
      console.log(`server has started on http://${hostname}:${port}`);
    }
  }
};

if (import.meta.main) {
  main();
}
