import { createRequire } from "node:module";

const native = createRequire(import.meta.url)(
  "../build/Release/node-blaze.node"
);

const kCanonicalSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
};

type Schema = object;
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
    const jsonObjToValidate = JSON.stringify(objToValidate);
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
   * Complies JSON Schema, cache internally compiled instructions, and then
   * validates some value against provided JSON Schema.
   * @param schema JSON Schema to compile.
   * @returns Validation function.
   */
  compile(schema: Schema) {
    this.#validateSchema(schema);
    const schemaWithCanonical = {
      ...kCanonicalSchema,
      ...schema,
    };

    let compiledSchema = this.#cache.get(schemaWithCanonical);
    if (!compiledSchema) {
      let jsonSchema = JSON.stringify(schemaWithCanonical);
      compiledSchema = native.compile(jsonSchema) as CompiledSchema;
      this.#cache.set(schemaWithCanonical, compiledSchema);
    }
    return createValidateFn(compiledSchema);
  }

  /**
   * Complies JSON Schema, cache internally compiled instructions,
   * function that should be invoked with object to validate.
   * @param schema JSON Schema to compile.
   * @param objToValidate Value that should be validated.
   * @returns `true` if validation pass, otherwise `false`.
   */
  validate(schema: Schema, objToValidate: ObjectToValidate) {
    return this.compile(schema)(objToValidate);
  }

  #validateSchema(schema: Schema) {
    assertObject(schema);
  }
}

const assertObject = (value: unknown) => {
  if (!value)
    throw new JsonSchemaValidationError(`Provided JSON Schema is falsy.`);
  if (typeof value !== "object")
    throw new JsonSchemaValidationError(
      `Provided JSON Schema value "${value}" is not a "object".`
    );
};
