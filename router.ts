import {redirectToNormalUrl, shortenDelete, shortenGet, shortenGetStats, shortenPost, shortenPut} from "./api/url.ts";

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
        // POST /shorten
        this.routes.push(new Route(/^\/shorten$/, Method.POST, shortenPost));

        // GET /shorten/{shortCode}
        this.routes.push(new Route(/^\/shorten\/([a-zA-Z0-9]+)$/, Method.GET, shortenGet));

        // PUT /shorten/{shortCode}
        this.routes.push(new Route(/^\/shorten\/([a-zA-Z0-9]+)$/, Method.PUT, shortenPut));

        // DELETE /shorten/{shortCode}
        this.routes.push(new Route(/^\/shorten\/([a-zA-Z0-9]+)$/, Method.DELETE, shortenDelete));

        // GET /shorten/{shortCode}/stats
        this.routes.push(new Route(/^\/shorten\/([a-zA-Z0-9]+)\/stats$/, Method.GET, shortenGetStats));

        // GET /{shortCode}
        this.routes.push(new Route(/^\/([a-zA-Z0-9]+)$/, Method.GET, redirectToNormalUrl));
    }

    async navigate(req: Request) {
        const url = new URL(req.url);
        const path = url.pathname;
        const method = req.method as Method;
        console.log(`${method} -> '${url}'`);
        for (const route of this.routes) {
            const match = path.match(route.regularExpression);
            if (match && method === route.method) {
                return route.handler(req);
            }
        }
        return new Response(await Bun.file("./front/index.html").bytes(), {
            headers: {
                "Content-Type": "text/html",
            },
        })
    }
}