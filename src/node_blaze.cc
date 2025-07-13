#include "node_blaze.h"
#include "sourcemeta/core/json_value.h"

#include <sourcemeta/blaze/compiler.h>
#include <sourcemeta/blaze/evaluator.h>

#include <sourcemeta/core/json.h>
#include <sourcemeta/core/jsonschema.h>

using namespace Napi;

NodeBlaze::NodeBlaze(const Napi::CallbackInfo &info) : ObjectWrap(info) {}

Napi::Value NodeBlaze::RunBlaze(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  Napi::String js_schema_str = info[0].As<Napi::String>();
  Napi::String js_json_str = info[1].As<Napi::String>();

  // (1) Get a JSON Schema
  // TODO: make sure about this conversation from Napi::String with Utf8Value
  const sourcemeta::core::JSON schema{
      sourcemeta::core::parse_json(js_schema_str.Utf8Value())};

  // (2) Compile the JSON Schema into an optimised representation
  const sourcemeta::blaze::Template compiled_schema{sourcemeta::blaze::compile(
      schema,

      // These options allow you tweak how Blaze works,
      // the JSON Schema vocabularies it understands,
      // and how to resolve references to external schemas
      sourcemeta::core::schema_official_walker,
      sourcemeta::core::schema_official_resolver,
      sourcemeta::blaze::default_schema_compiler,

      // Fast validation means getting to a boolean result
      // as fast as possible. Check out the documentation
      // for how to get detailed error information and/or
      // collect JSON Schema annotations
      sourcemeta::blaze::Mode::FastValidation)};

  // (3) Get a JSON instance
  // TODO: maybe there is some smart way of passing Object (Napi::Value) to
  // this sourcemeta::core::JSON instead of parsing it here?
  const sourcemeta::core::JSON instance{
      sourcemeta::core::parse_json(js_json_str.Utf8Value())};

  // (4) Validate the instance against the schema
  sourcemeta::blaze::Evaluator evaluator;
  const bool result{evaluator.validate(compiled_schema, instance)};

  return Napi::Boolean::New(env, result);
}

/**
    Returns class definition that is used by Node-API to know how to used
   methods defined in C++ class.
*/
Napi::Function NodeBlaze::GetClass(Napi::Env env) {
  return DefineClass(
      env, "NodeBlaze",
      {
          NodeBlaze::InstanceMethod("runBlaze", &NodeBlaze::RunBlaze),
      });
}

/**
    Defines the "exports" of the module. Analogues to the "exports" defined by
   JS module.
*/
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  Napi::String name = Napi::String::New(env, "NodeBlaze");
  exports.Set(name, NodeBlaze::GetClass(env));
  return exports;
}

NODE_API_MODULE(addon, Init)
