import { MappingRecord, ProxyRecord, StaticRecord } from "./config.ts";
import { proxy, Router, serveStatic } from "./deps.ts";

const split_url = (url: string) => {
  if (url.includes("?")) {
    const index = url.indexOf("?");
    return [url.substring(0, index), url.substring(index)] as const;
  }
  return [url, ""] as const;
};

export const createProxy = (record: ProxyRecord) => {
  // TODO replace url
  return proxy(record.target, {
    parseReqBody: true,
    proxyReqUrlDecorator(url, req) {
      const [pathname, search] = split_url(req.url);
      url.pathname = pathname;
      url.search = search;
      console.log(`[*] P -> ${url}`);
      return url;
    },
  });
};

export const createStatic = (record: StaticRecord) => {
  return serveStatic(record.path, {
    before(_: Response, path: string) {
      console.log(`[*] S -> ${path}`);
    },
  });
};

export const createRouter = (mappings: MappingRecord[]) => {
  const router = new Router();
  for (const mapping of mappings) {
    if (mapping.type === "proxy") {
      console.log(`proxy: ${mapping.key} -> ${mapping.target}`);
      router.all(mapping.key, createProxy(mapping));
    } else if (mapping.type === "static") {
      console.log(`static: ${mapping.key} -> ${mapping.path}`);
      router.use(mapping.key, createStatic(mapping));
    }
  }
  return router;
};
