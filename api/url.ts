import {UrlModel} from "../models/UrlModel.ts";

async function shortenPost(req: Request) {
    const {url} = await req.json();
    if (!URL.canParse(url)) return new Response("Invalid URL", {status: 400});
    const urlObj = UrlModel.create(url);
    if (!urlObj) return new Response("URL not created", {status: 500});
    return ResponseUrlObjJson(urlObj);
}

async function shortenPut(req: Request) {
    const urlObj = getUrlObjFromReq(req);
    if (!urlObj) return Response404();

    const {url} = await req.json();
    if (!URL.canParse(url)) return new Response("Invalid URL", {status: 400});
    urlObj.url = url;
    urlObj.save();
    return ResponseUrlObjJson(urlObj);
}

async function shortenDelete(req: Request) {
    const urlObj = getUrlObjFromReq(req);
    if (!urlObj) return Response404();

    UrlModel.delete(urlObj);
    return new Response("URL deleted", {status: 200});
}

async function shortenGet(req: Request) {
    const urlObj = getUrlObjFromReq(req);
    if (!urlObj) return Response404();

    return ResponseUrlObjJson(urlObj);
}

async function shortenGetStats(req: Request) { //Duplicate code
    const urlObj = getUrlObjFromReq(req);
    if (!urlObj) return Response404();

    return ResponseUrlObjJson(urlObj);
}

function getUrlObjFromReq(req: Request) {
    const url = new URL(req.url);
    const shortCode = url.pathname.split("/")[2];
    return UrlModel.getFromShortCode(shortCode);
}

function Response404() {
    return new Response("URL not found", {status: 404});
}

function ResponseUrlObjJson(urlObj: UrlModel) {
    return new Response(JSON.stringify(urlObj.toJson()), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

function redirectToNormalUrl(req: Request) {
    const urlObj = UrlModel.getFromShortCode((new URL(req.url)).pathname.split("/")[1]);
    if (!urlObj) return Response404();
    urlObj.accessCount++;
    urlObj.save();
    return Response.redirect(urlObj.url, 301);
}

export {redirectToNormalUrl, shortenPost, shortenGet, shortenPut, shortenDelete, shortenGetStats};