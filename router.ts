import { readdir } from "node:fs/promises";
import {redirectToNormalUrl} from "./api/url.ts";

export class Router {
    handlers: Map<string, Function> = new Map();

    async populateHandlers() {
        const files = await readdir("./api");
        for (const file of files) {
            const module = await import(`./api/${file}`);
            const handler = module.default;
            this.handlers.set(`/${file.split(".")[0]}`, handler);
        }
    }

    async navigate(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const route = url.pathname;
        const handler = this.handlers.get(route);
        if (handler) {
            return await handler(req);
        } else {
            return redirectToNormalUrl(url);
        }
    }
}