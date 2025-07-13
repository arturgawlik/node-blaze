#include "node_blaze.h"

using namespace Napi;

NodeBlaze::NodeBlaze(const Napi::CallbackInfo &info) : ObjectWrap(info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[0].IsString()) {
    Napi::TypeError::New(env, "You need to name yourself")
        .ThrowAsJavaScriptException();
    return;
  }

  this->_greeterName = info[0].As<Napi::String>().Utf8Value();
}

Napi::Value NodeBlaze::Greet(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsString()) {
    Napi::TypeError::New(env, "You need to introduce yourself to greet")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  Napi::String name = info[0].As<Napi::String>();

  printf("Hello %s\n", name.Utf8Value().c_str());
  printf("I am %s\n", this->_greeterName.c_str());

  return Napi::String::New(env, this->_greeterName);
}

/**
    Returns class definition that is used by Node-API to know how to used
   methods defined in C++ class.
*/
Napi::Function NodeBlaze::GetClass(Napi::Env env) {
  return DefineClass(env, "NodeBlaze",
                     {
                         NodeBlaze::InstanceMethod("greet", &NodeBlaze::Greet),
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
