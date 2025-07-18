import { test } from "node:test";
import assert from "node:assert";
import { Blaze } from "../lib/blaze.js";

test("should pass validation", () => {
  const blaze = new Blaze();
  const validateFn = blaze.compile({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "number",
  });
  const result = validateFn(1234);
  assert.equal(result, true);
});

test("should do not pass validation", () => {
  const blaze = new Blaze();
  const validateFn = blaze.compile({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "number",
  });
  const result = validateFn("1234");
  assert.equal(result, false);
});
