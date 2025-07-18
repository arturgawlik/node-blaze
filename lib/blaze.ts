import { createRequire } from "node:module";

const native = createRequire(import.meta.url)(
  "../build/Release/node-blaze.node"
);

type Schema = object | string;
type CompiledSchema = object;
type ObjectToValidate = unknown;

const createValidateFn = (compiledSchema: CompiledSchema) => {
  // TODO: provide option and implement option for "sourcemeta::blaze::Mode::Exhaustive" validation
  /**
   * Validates some value against previously provided JSON Schema.
   * @param objToValidate Value that should be validated.
   * @returns `true` if validation pass, otherwise `false`.
   */
  return (objToValidate: ObjectToValidate): boolean => {
    // TODO: try to find other solution rather that stringify and then parsing on the C++ land
    //       if other solution can't be find try to maybe some more optimal parsers?
    const jsonObjToValidate =
      typeof objToValidate === "object"
        ? JSON.stringify(objToValidate)
        : objToValidate;
    // TODO: provide some .d.ts for C++ land
    return native.validate(compiledSchema, jsonObjToValidate);
  };
};

class JsonSchemaValidationError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class Blaze {
  #cache = new Map<Schema, CompiledSchema>();

  /**
   * Complies JSON Schema, cache internally compiled instructions, and returns
   * function that should be invoked with object to validate.
   * @param schema JSON Schema to compile.
   * @returns Validation function.
   */
  compile(schema: Schema) {
    this.#validateSchema(schema);
    let compiledSchema = this.#cache.get(schema);
    if (!compiledSchema) {
      let jsonSchema =
        typeof schema === "object" ? JSON.stringify(schema) : schema;
      compiledSchema = native.compile(jsonSchema) as CompiledSchema;
      this.#cache.set(schema, compiledSchema);
    }
    return createValidateFn(compiledSchema);
  }

  #validateSchema(schema: Schema) {
    assertStringOrObject(schema);
  }
}

const assertStringOrObject = (value: unknown) => {
  if (!value)
    throw new JsonSchemaValidationError(`Provided JSON Schema is falsy.`);
  const schemaTypeof = typeof value;
  if (schemaTypeof !== "string" && schemaTypeof !== "object")
    throw new JsonSchemaValidationError(
      `Provided JSON Schema "${value}" is not "object" or "string".`
    );
};
