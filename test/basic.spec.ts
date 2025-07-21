import { describe, test } from "node:test";
import assert from "node:assert";
import { Blaze } from "../lib/blaze.ts";

const basicJsonSchema = {
  type: "number",
};

describe("Blaze.compile", () => {
  test("should pass validation", () => {
    const blaze = new Blaze();
    const validateFn = blaze.compile(basicJsonSchema);
    const result = validateFn(1234);
    assert.equal(result, true);
  });

  test("should do not pass validation", () => {
    const blaze = new Blaze();
    const validateFn = blaze.compile(basicJsonSchema);
    const result = validateFn("1234");
    assert.equal(result, false);
  });
});

describe("Blaze.validate", () => {
  test("should pass validation", () => {
    const blaze = new Blaze();
    const result = blaze.validate(basicJsonSchema, 1234);
    assert.equal(result, true);
  });

  test("should do not pass validation", () => {
    const blaze = new Blaze();
    const result = blaze.validate(basicJsonSchema, "1234");
    assert.equal(result, false);
  });
});
