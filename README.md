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
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "number",
});
const result = validateFn("1234");
console.log(result); // false
```

## Performance

In my simple (and probably very naive) test https://github.com/arturgawlik/node-blaze/blob/63822e54f9b1c5db5513ed003c1dd21c40a15871/test/performance.ts it seems that `node-blaze` is at least couple times faster than `Ajv`:

```text
node-blaze: 657.67ms
ajv: 4.754s
```
