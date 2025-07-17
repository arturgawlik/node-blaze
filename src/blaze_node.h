#pragma once

#include <napi.h>

namespace blaze_node {
Napi::Value compile(const Napi::CallbackInfo &);
Napi::Value validate(const Napi::CallbackInfo &);
} // namespace blaze_node
