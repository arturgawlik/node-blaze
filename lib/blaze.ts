import { createRequire } from "node:module";

// TODO: make it work `import` with .node file
const native = createRequire(import.meta.url)(
  "../build/Release/node-blaze.node"
);

type Schema = object;
type CompiledSchema = object;
type ObjectToValidate = unknown;

const createValidateFn = (compiledSchema: CompiledSchema) => {
  // TODO: provide option and implement option for "sourcemeta::blaze::Mode::Exhaustive" validation
  return (objToValidate: ObjectToValidate): boolean => {
    // TODO: validate input
    // TODO: try to find other solution rather that stringify and then parsing on the C++ land
    //       if other solution can't be find try to maybe some more optimal parsers?
    const jsonObjToValidate = JSON.stringify(objToValidate);
    // TODO: provide some .d.ts for C++ land
    return native.validate(compiledSchema, jsonObjToValidate);
  };
};

export class Blaze {
  #cache = new Map<Schema, CompiledSchema>();

  compile(schema: Schema) {
    // TODO: validate input
    let compiledSchema = this.#cache.get(schema);
    if (!compiledSchema) {
      const jsonSchema = JSON.stringify(schema);
      compiledSchema = native.compile(jsonSchema) as CompiledSchema;
      this.#cache.set(schema, compiledSchema);
    }
    return createValidateFn(compiledSchema);
  }
}
