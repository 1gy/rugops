import type { DeepNonNullable } from "./types.ts";

export type ProxyRecord = {
  type: "proxy";
  key: string;
  target: string;
};

export type StaticRecord = {
  type: "static";
  key: string;
  path: string;
};

export type MappingRecord = ProxyRecord | StaticRecord;

export type RugopsConfig = {
  readonly server?: {
    readonly port?: number;
    readonly host?: string;
  };
  readonly mapping?: MappingRecord[];
};

export const defaultConfig: DeepNonNullable<RugopsConfig> = {
  server: { port: 8080, host: "localhost" },
  mapping: [],
};

export const loadConfig = async (): Promise<RugopsConfig> => {
  try {
    const text = await Deno.readTextFile("./rugops.json");
    return JSON.parse(text) as RugopsConfig;
  } catch (_) {
    return {};
  }
};
