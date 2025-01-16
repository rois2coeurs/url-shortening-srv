import {Router} from "./router.ts";

const router = new Router();

console.info("Populating handlers...");

await router.populateHandlers();

console.info("Handlers populated");

console.info("Starting server...");

const server = Bun.serve({
    port: 3000,
    development: true,
    static: {
        "/": new Response(await Bun.file('front/index.html').bytes(), {
            headers: {
                "Content-Type": "text/html",
            }
        }),
        "/script.js": new Response(await Bun.file('front/script.js').bytes(), {
            headers: {
                "Content-Type": "application/javascript",
            }
        }),
        "/style.css": new Response(await Bun.file('front/style.css').bytes(), {
            headers: {
                "Content-Type": "text/css",
            }
        })
    },
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