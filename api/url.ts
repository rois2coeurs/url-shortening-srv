import {UrlModel} from "../models/UrlModel.ts";

function get() {
    return new Response(JSON.stringify(UrlModel.getAll()), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

async function post(req: Request) {
    const {url} = await req.json();
    new UrlModel(url);
    return new Response("URL added", {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}

export default async function handler(req: Request) {
    if (req.method === "GET") return get();
    if (req.method === "POST") return await post(req);
    throw new Error("Method not allowed");
}

function redirectToNormalUrl(shortUrl: string) {
    const url = UrlModel.getNormalUrl(shortUrl);
    if (url) {
        return Response.redirect(url, 301);
    } else {
        return new Response("URL not found", {
            status: 404,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }
}

export {redirectToNormalUrl};