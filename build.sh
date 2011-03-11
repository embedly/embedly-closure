#!/bin/sh

CLOSURE_LIB="../closure-library"
CLOSURE_COMPILER="../closure-compiler"

python "${CLOSURE_LIB}/closure/bin/build/closurebuilder.py" \
  --namespace embedly.exports \
  --root . \
  --root "${CLOSURE_LIB}" \
  -o compiled \
  -c "${CLOSURE_COMPILER}/compiler.jar" \
  -f --compilation_level=ADVANCED_OPTIMIZATIONS \
  --output_file=embedly.min.js
