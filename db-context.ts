import {Database} from "bun:sqlite";

const db = new Database("./data/url-shortening.db", { create: true });

const tableExists = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='URL';").get();

if (!tableExists) {
    const createTableSQL = await Bun.file("./CreateDB.sql").text();
    db.exec(createTableSQL);
}

export {db};
