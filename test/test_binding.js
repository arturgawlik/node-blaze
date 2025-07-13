import { test } from "node:test";
import assert from "node:assert";
import NodeBlaze from "../lib/binding.js"

test('should return Success', () => {
    const instance = new NodeBlaze();
    const result = instance.runBlaze(`{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "number"
  }`, '1234');
    assert.equal(result, true, "The expected string 'Success' was not returned.");
});
