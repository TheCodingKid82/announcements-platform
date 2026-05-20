import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

export type IdPrefix =
  | "usr"
  | "org"
  | "lst"
  | "sub"
  | "ann"
  | "del"
  | "src"
  | "evt"
  | "wh"
  | "agt"
  | "run"
  | "key";

export function createId(prefix: IdPrefix) {
  return `${prefix}_${nanoid()}`;
}
