#pragma once

#include <napi.h>

class NodeBlaze : public Napi::ObjectWrap<NodeBlaze> {
public:
  NodeBlaze(const Napi::CallbackInfo &);
  Napi::Value Greet(const Napi::CallbackInfo &);

  static Napi::Function GetClass(Napi::Env);

private:
  std::string _greeterName;
};
