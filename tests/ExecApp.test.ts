import {spawn} from "bun";
import {describe, test, expect} from "bun:test";

describe("ExecApp", () => {
    test("launch application without errors", async () => {
        const process = spawn(["bun", "run", "index.ts", "--test"]);

        await process.exited;

        expect(process.exitCode).toBe(0);
    });
});