import {redirectToNormalUrl, shortenDelete, shortenGet, shortenGetStats, shortenPost, shortenPut} from "./api/url.ts";
import type {Server} from "bun";

enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

class Route {
    regularExpression: RegExp;
    method: Method;
    handler: Function;

    constructor(regularExpression: RegExp, method: Method, handler: Function) {
        this.regularExpression = regularExpression;
        this.method = method;
        this.handler = handler;
    }
}

export class Router {
    routes: Route[] = [];

    async populateHandlers() {
        // GET /{shortCode}
        this.routes.push(new Route(/^\/([a-zA-Z0-9-_]{6})$/, Method.GET, redirectToNormalUrl));

        // POST /shorten
        this.routes.push(new Route(/^\/shorten$/, Method.POST, shortenPost));

        // GET /shorten/{shortCode}
        this.routes.push(new Route(/^\/shorten\/([a-zA-Z0-9-_]{6})$/, Method.GET, shortenGet));

        // PUT /shorten/{shortCode}
        this.routes.push(new Route(/^\/shorten\/([a-zA-Z0-9-_]{6})$/, Method.PUT, shortenPut));

        // DELETE /shorten/{shortCode}
        this.routes.push(new Route(/^\/shorten\/([a-zA-Z0-9-_]{6})$/, Method.DELETE, shortenDelete));

        // GET /shorten/{shortCode}/stats
        this.routes.push(new Route(/^\/shorten\/([a-zA-Z0-9-_]{6})\/stats$/, Method.GET, shortenGetStats));

    }

    async navigate(req: Request, server: Server) {
        const url = new URL(req.url);
        const path = url.pathname;
        const method = req.method as Method;
        const ip = server.requestIP(req);
        console.log(`${ip?.address} : [${method}] -> ${path}`);
        if (path === "/") {
            return new Response(await Bun.file("./front/index.html").bytes(), {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }
        for (const route of this.routes) {
            const match = path.match(route.regularExpression);
            if (match && method === route.method) {
                return route.handler(req);
            }
        }
        return new Response("Not found", {status: 404});
    }
}