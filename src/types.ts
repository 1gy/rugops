// deno-lint-ignore-file
type Primitive = number | string | boolean | bigint | symbol | undefined | null;
type Builtin = Primitive | Function | Date | Error | RegExp;

export type DeepNonNullable<T> = T extends Builtin ? NonNullable<T>
  : { [key in keyof T]-?: DeepNonNullable<T[key]> };
