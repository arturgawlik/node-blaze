## node-blaze

Very simple Node.js bindings to https://github.com/sourcemeta/blaze - ultra high-performance C++ JSON Schema validator.

## Example usage

### Install

```bash
npm i node-blaze
```

### Usage

```typescript
import { Blaze } from "node-blaze";

const blaze = new Blaze();
const validateFn = blaze.compile({
  type: "number",
});
const result = validateFn("1234");
console.log(result); // false
```

## Performance

In my simple (and probably very naive) `npm run benchmark` it seems that `node-blaze` is slower than `ajv` probably because of that currently data through node <-> blaze is passed in very no optimal way. This will be improved. Also `Ajv` itself is very fast:

```text
┌─────────┬────────────────────────────────────────────────────────────────────────────┬───────────────────┬────────────────────┬────────────────────────┬────────────────────────┬──────────┐
│ (index) │ Task name                                                                  │ Latency avg (ns)  │ Latency med (ns)   │ Throughput avg (ops/s) │ Throughput med (ops/s) │ Samples  │
├─────────┼────────────────────────────────────────────────────────────────────────────┼───────────────────┼────────────────────┼────────────────────────┼────────────────────────┼──────────┤
│ 0       │ 'ajv - create Ajv instance and validation method every iteration'          │ '4901044 ± 1.15%' │ '4823060 ± 207175' │ '205 ± 0.94%'          │ '207 ± 9'              │ 205      │
│ 1       │ 'ajv - create validation method every iteration'                           │ '55.96 ± 0.45%'   │ '53.00 ± 1.00'     │ '18555208 ± 0.00%'     │ '18867924 ± 362845'    │ 17869641 │
│ 2       │ 'ajv'                                                                      │ '54.08 ± 10.15%'  │ '46.00 ± 1.00'     │ '21160137 ± 0.00%'     │ '21739130 ± 483092'    │ 18491458 │
│ 3       │ 'ajv with code.optimize flag'                                              │ '50.20 ± 5.69%'   │ '46.00 ± 1.00'     │ '21341754 ± 0.00%'     │ '21739130 ± 483092'    │ 19920251 │
│ 4       │ 'node-blaze - create Blaze instance and validation method every iteration' │ '629319 ± 0.11%'  │ '627344 ± 3027.5'  │ '1590 ± 0.09%'         │ '1594 ± 8'             │ 1590     │
│ 5       │ 'node-blaze - create validation method every iteration'                    │ '629057 ± 0.20%'  │ '626918 ± 2819.0'  │ '1591 ± 0.12%'         │ '1595 ± 7'             │ 1590     │
│ 6       │ 'node-blaze'                                                               │ '2049.4 ± 0.04%'  │ '2025.0 ± 58.00'   │ '490611 ± 0.02%'       │ '493827 ± 14045'       │ 487953   │
└─────────┴────────────────────────────────────────────────────────────────────────────┴───────────────────┴────────────────────┴────────────────────────┴────────────────────────┴──────────┘
```

## Maintenance

### Publishing new version to npm

1. Bump version in `package.json`.
2. Run `npm publish` in project root directory.
