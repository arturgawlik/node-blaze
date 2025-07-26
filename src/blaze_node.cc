#include "blaze_node.h"
#include "napi.h"
#include "sourcemeta/blaze/compiler_output.h"
#include "sourcemeta/core/json_value.h"

#include <cstdint>
#include <sourcemeta/blaze/compiler.h>
#include <sourcemeta/blaze/evaluator.h>

#include <sourcemeta/core/json.h>
#include <sourcemeta/core/jsonschema.h>

using namespace Napi;

namespace blaze_node {
Value compile(const CallbackInfo &info) {
  Env env = info.Env();
  String js_schema_str = info[0].As<String>();

  const auto schema{sourcemeta::core::parse_json(js_schema_str)};
  const auto compiled_schema{sourcemeta::blaze::compile(
      schema, sourcemeta::core::schema_official_walker,
      sourcemeta::core::schema_official_resolver,
      sourcemeta::blaze::default_schema_compiler)};

  auto js_compiled_schema = External<sourcemeta::blaze::Template>::New(
      env, new sourcemeta::blaze::Template(std::move(compiled_schema)),
      [](Env, sourcemeta::blaze::Template *compiled_schema) {
        delete compiled_schema;
      });

  return js_compiled_schema;
}

Value validate(const CallbackInfo &info) {
  const auto env = info.Env();
  const auto js_compiled_schema =
      info[0].As<External<sourcemeta::blaze::Template>>();
  const auto js_object_json = info[1].As<Napi::String>();
  const auto compiled_schema = js_compiled_schema.Data();

  sourcemeta::blaze::Evaluator evaluator;
  const auto js_object{sourcemeta::core::parse_json(js_object_json)};
  sourcemeta::blaze::SimpleOutput output{js_object};

  const auto result{
      evaluator.validate(*compiled_schema, js_object, std::ref(output))};

  const auto js_result = Object::New(env);
  const auto js_result_errors = Array::New(env);
  js_result.Set(String::New(env, "valid"), result);
  js_result.Set(String::New(env, "errors"), js_result_errors);
  const auto js_result_errors_message_key = String::New(env, "message");
  const auto js_result_errors_instance_location_key =
      String::New(env, "instanceLocation");
  const auto js_result_errors_evaluate_path_key =
      String::New(env, "evaluatePath");
  const auto js_result_errors_schema_location_key =
      String::New(env, "schemaLocation");
  if (!result) {
    uint32_t i = 0;
    for (const auto &entry : output) {
      const auto js_entry = Object::New(env);
      js_entry.Set(js_result_errors_message_key,
                   String::New(env, entry.message));
      js_entry.Set(js_result_errors_instance_location_key,
                   String::New(env, sourcemeta::core::to_string(
                                        entry.instance_location)));
      js_entry.Set(
          js_result_errors_evaluate_path_key,
          String::New(env, sourcemeta::core::to_string(entry.evaluate_path)));
      js_entry.Set(js_result_errors_schema_location_key,
                   String::New(env, entry.schema_location.get()));
      js_result_errors.Set(i++, js_entry);
    }
  }

  return js_result;
}

} // namespace blaze_node

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("compile", Napi::Function::New(env, blaze_node::compile));
  exports.Set("validate", Napi::Function::New(env, blaze_node::validate));
  return exports;
}

NODE_API_MODULE(addon, Init)
