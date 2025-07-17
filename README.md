### node-blaze

Very simple Node.js bindings to https://github.com/sourcemeta/blaze - ultra high-performance C++ JSON Schema validator.

### Example usage

```typescript
import { Blaze } from "node-blaze";

const blaze = new Blaze();
const validateFn = blaze.compile({
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "number",
});
const result = validateFn(1234);
console.log(result); // false
```

### Performance

In my simple (and probably very naive) test it seems that blaze is at least couple times faster than `Ajv`:

```text
blaze: 657.67ms
ajv: 4.754s
```
