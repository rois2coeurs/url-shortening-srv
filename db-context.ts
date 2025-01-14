import {Database} from "bun:sqlite";

const db = new Database("url-shortening.db", { create: true });

export {db};
