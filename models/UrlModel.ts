import {db} from "../db-context.ts";
import {randomBytes} from "node:crypto";

export class UrlModel {
    readonly id: number;
    url: string;
    readonly shortCode: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    accessCount: number;
    private isValid: boolean = true;

    private constructor(id: number, url: string, shortCode: string, createdAt: Date, updatedAt: Date, accessCount: number) {
        this.id = id;
        this.url = url;
        this.shortCode = shortCode;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.accessCount = accessCount;
    }

    static generateShortCode() {
        const existingShortCodes = new Set<string>();
        const query = db.prepare(`SELECT shortCode
                                  FROM URL`);
        const rows = query.all() as { shortCode: string }[];
        for (const row of rows) {
            existingShortCodes.add(row.shortCode);
        }
        let shortCode: string;
        do {
            shortCode = randomBytes(6).toString('base64url').substring(2, 8);
        } while (existingShortCodes.has(shortCode));
        return shortCode;
    }

    static delete(urlObj: UrlModel) {
        if (!urlObj.isValid) throw new Error("UrlModel is not valid");
        const query = db.prepare(`DELETE
                                  FROM URL
                                  WHERE id = ?;`);
        query.run(urlObj.id);
        urlObj.isValid = false;
    }

    toJson() {
        return {
            id: this.id,
            url: this.url,
            shortCode: this.shortCode,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            accessCount: this.accessCount
        }
    }

    static getFromId(id: number): UrlModel | null {
        const query = db.prepare(`SELECT *
                                  FROM URL
                                  WHERE id = ?;`);
        const url = query.get(id) as UrlModel;
        if (!url) return null;
        return new UrlModel(url.id, url.url, url.shortCode, url.createdAt, url.updatedAt, url.accessCount);
    }

    static getFromShortCode(shortCode: string): UrlModel | null {
        const query = db.prepare(`SELECT *
                                  FROM URL
                                  WHERE shortCode = ?;`);
        const url = query.get(shortCode) as UrlModel;
        if (!url) return null;
        return new UrlModel(url.id, url.url, url.shortCode, url.createdAt, url.updatedAt, url.accessCount);
    }

    static create(url: string): UrlModel | null {
        const shortCode = UrlModel.generateShortCode();
        const query = db.prepare(`INSERT INTO URL (url, shortCode)
                                  VALUES (?, ?);`);
        const res = query.run(url, shortCode);
        return UrlModel.getFromId(res.lastInsertRowid as number);
    }

    save() {
        if (!this.isValid) throw new Error("UrlModel is not valid");
        const query = db.prepare(`UPDATE URL
                                  SET url         = ?,
                                      accessCount = ?
                                  WHERE id = ?;`);
        query.get(this.url, this.accessCount, this.id);
    }
}