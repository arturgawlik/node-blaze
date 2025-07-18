import { Blaze } from "../lib/blaze.js";
import { Ajv } from "ajv";

const runBlaze = () => {
  const blaze = new Blaze();
  const validateFn = blaze.compile({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "number",
  });
  validateFn("1234");
};

const runAjv = () => {
  const ajv = new Ajv();
  const validateFn = ajv.compile({
    type: "number",
  });
  validateFn("1234");
};

console.time("node-blaze");
for (let i = 0; i < 1000; i++) {
  runBlaze();
}
console.timeEnd("node-blaze");

console.time("ajv");
for (let i = 0; i < 1000; i++) {
  runAjv();
}
console.timeEnd("ajv");
