// TODO: rewrite to node:test
const NodeBlaze = require("../lib/binding.js");
const assert = require("assert");

assert(NodeBlaze, "The expected module is undefined");

function testBasic() {
    const instance = new NodeBlaze("mr-yeoman");
    assert(instance.greet, "The expected method is not defined");
    assert.strictEqual(instance.greet("kermit"), "mr-yeoman", "Unexpected value returned");
}

function testInvalidParams() {
    const instance = new NodeBlaze();
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");
assert.throws(testInvalidParams, undefined, "testInvalidParams didn't throw");

console.log("Tests passed- everything looks OK!");