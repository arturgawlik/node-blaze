import { Blaze } from "../lib/blaze.ts";
import { Ajv } from "ajv";
import { Bench } from "tinybench";

const schema = {
  type: "number",
};
const valueToValidate = "1234";
const ajv = new Ajv();
const ajvCodeOptimize = new Ajv({ code: { optimize: true } });
const ajvValidateFn = ajv.compile(schema);
const ajvCodeOptimizeValidateFn = ajvCodeOptimize.compile(schema);
const blaze = new Blaze();
const blazeValidateFn = blaze.compile(schema);

const bench = new Bench({ time: 100 })
  .add(
    "ajv - create Ajv instance and validation method every iteration",
    () => {
      const ajv = new Ajv();
      const ajvValidateFn = ajv.compile(schema);
      ajvValidateFn(valueToValidate);
    }
  )
  .add("ajv - create validation method every iteration", () => {
    const ajvValidateFn = ajv.compile(schema);
    ajvValidateFn(valueToValidate);
  })
  .add("ajv", () => {
    ajvValidateFn(valueToValidate);
  })
  .add("ajv with code.optimize flag", () => {
    ajvCodeOptimizeValidateFn(valueToValidate);
  })
  .add(
    "node-blaze - create Blaze instance and validation method every iteration",
    () => {
      const blaze = new Blaze();
      const blazeValidateFn = blaze.compile(schema);
      blazeValidateFn(valueToValidate);
    }
  )
  .add("node-blaze - create validation method every iteration", () => {
    const blazeValidateFn = blaze.compile(schema);
    blazeValidateFn(valueToValidate);
  })
  .add("node-blaze", () => {
    blazeValidateFn(valueToValidate);
  });

bench.runSync();

console.table(bench.table());
