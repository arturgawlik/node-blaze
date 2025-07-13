import { test } from "node:test";
import assert from "node:assert";
import NodeBlaze from "../lib/binding.js"

test('should work basic 1', () => {
    const instance = new NodeBlaze("mr-yeoman");
    assert(instance.greet, "The expected method is not defined");
    assert.strictEqual(instance.greet("kermit"), "mr-yeoman", "Unexpected value returned");
});

test('should work basic ', () => {
    assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");
    assert.throws(testInvalidParams, undefined, "testInvalidParams didn't throw");
});

function testBasic() {
    const instance = new NodeBlaze("mr-yeoman");
    assert(instance.greet, "The expected method is not defined");
    assert.strictEqual(instance.greet("kermit"), "mr-yeoman", "Unexpected value returned");
}

function testInvalidParams() {
    const instance = new NodeBlaze();
}
