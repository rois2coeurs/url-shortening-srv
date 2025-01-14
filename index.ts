import {Router} from "./router.ts";

const router = new Router();

console.info("Populating handlers...");

await router.populateHandlers();

console.info("Handlers populated");

console.info("Starting server...");

const server = Bun.serve({
    port: 3000,
    development: true,
    async fetch(request: Request): Promise<Response> {
        return await router.navigate(request);
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