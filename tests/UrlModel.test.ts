import {expect, test, describe} from "bun:test";
import {UrlModel} from "../models/UrlModel.ts";
import {db} from "../db-context.ts";


describe("UrlModel", () => {
    test("generateShortCode", () => {
        expect(UrlModel.generateShortCode()).toMatch(/^[A-Za-z0-9_-]{6}$/);
    });

    test("create", () => {
        const url = "https://google.com";
        const urlObj = UrlModel.create(url);
        expect(urlObj).not.toBeNull();
        expect(urlObj.url).toBe(url);
        const urlObjFromDb = db.query("SELECT * FROM URL WHERE id = ?;").as(UrlModel).get(urlObj.id);
        expect(urlObjFromDb).not.toBeNull();
        expect(urlObjFromDb?.id).toBe(urlObj.id);
        UrlModel.delete(urlObj);
    });

    test("delete", () => {
        const urlObj = UrlModel.create("https://google.com");
        expect(urlObj).not.toBeNull();
        UrlModel.delete(urlObj);
        const urlObjFromDb = db.query("SELECT * FROM URL WHERE id = ?;").as(UrlModel).get(urlObj.id);
        expect(urlObjFromDb).toBeNull();
        expect(urlObj.isValid).toBe(false);
    });


    test("toJson", () => {
        const urlObj = UrlModel.create("https://google.com");
        expect(urlObj).not.toBeNull();
        const urlObjJson = urlObj.toJson();
        expect(urlObjJson).not.toBeNull();
        expect(urlObjJson.id).toBe(urlObj.id);
        expect(urlObjJson.url).toBe(urlObj.url);
        expect(urlObjJson.shortCode).toBe(urlObj.shortCode);
        expect(urlObjJson.createdAt).toBe(urlObj.createdAt);
        expect(urlObjJson.updatedAt).toBe(urlObj.updatedAt);
        expect(urlObjJson.accessCount).toBe(urlObj.accessCount);
        UrlModel.delete(urlObj);
    });

    test("getFromId", () => {
        const urlObj = UrlModel.create("https://google.com");
        expect(urlObj).not.toBeNull();
        const urlObjFromId = UrlModel.getFromId(urlObj.id);
        expect(urlObjFromId).not.toBeNull();
        expect(urlObjFromId?.id).toBe(urlObj.id);
        expect(urlObjFromId?.url).toBe(urlObj.url);
        expect(urlObjFromId?.shortCode).toBe(urlObj.shortCode);
        expect(urlObjFromId?.createdAt).toBe(urlObj.createdAt);
        expect(urlObjFromId?.updatedAt).toBe(urlObj.updatedAt);
        UrlModel.delete(urlObj);
    });

    test("getFromShortCode", () => {
        const urlObj = UrlModel.create("https://google.com");
        expect(urlObj).not.toBeNull();
        const urlObjFromShortCode = UrlModel.getFromShortCode(urlObj.shortCode);
        expect(urlObjFromShortCode).not.toBeNull();
        expect(urlObjFromShortCode?.id).toBe(urlObj.id);
        expect(urlObjFromShortCode?.url).toBe(urlObj.url);
        expect(urlObjFromShortCode?.shortCode).toBe(urlObj.shortCode);
        expect(urlObjFromShortCode?.createdAt).toBe(urlObj.createdAt);
        expect(urlObjFromShortCode?.updatedAt).toBe(urlObj.updatedAt);
        UrlModel.delete(urlObj);
    });
});