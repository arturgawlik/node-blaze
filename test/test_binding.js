import { test } from "node:test";
import assert from "node:assert";
import NodeBlaze from "../lib/binding.js"

test('should return Success', () => {
    const instance = new NodeBlaze();
    assert(instance.runBlaze(), "The expected string 'Success' was not returned.");
});
