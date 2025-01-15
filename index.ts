import {Router} from "./router.ts";
import type {Server} from "bun";

const router = new Router();

console.info("Populating handlers...");

await router.populateHandlers();

console.info("Handlers populated");

console.info("Starting server...");

const server = Bun.serve({
    port: 3000,
    development: true,
    async fetch(request: Request, server: Server): Promise<Response> {
        return await router.navigate(request, server);
    },
    error(error) {
        return new Response(`<pre>${error}\n${error.stack}</pre>`, {
            headers: {
                "Content-Type": "text/html",
            },
        });
    },
});

console.log(`Server running at ${server.url} !`);