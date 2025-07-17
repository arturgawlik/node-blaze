
cmake_minimum_required(VERSION 3.31)
cmake_policy(SET CMP0042 NEW)
set(CMAKE_CXX_STANDARD 20)
include(FetchContent)

project (node-blaze)

# generate compile_commands.json
SET(CMAKE_EXPORT_COMPILE_COMMANDS on)

# add the project as a CMake subdirectory
add_subdirectory("${PROJECT_SOURCE_DIR}/deps/blaze")

# define NAPI_VERSION
add_definitions(-DNAPI_VERSION=10)

include_directories(${CMAKE_JS_INC})

set(HEADER_FILES
  "src/blaze_node.h"
)
set(SOURCE_FILES
  "src/blaze_node.cc"
)

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${HEADER_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# link cmake-js
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})

# link blaze
target_link_libraries(${PROJECT_NAME} PUBLIC sourcemeta::blaze::evaluator)
target_link_libraries(${PROJECT_NAME} PUBLIC sourcemeta::blaze::compiler)

# include Node-API wrappers
execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )
string(REGEX REPLACE "[\r\n\"]" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})

target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})
