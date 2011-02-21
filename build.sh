python ../closure-library/closure/bin/build/closurebuilder.py \
  --namespace embedly.Api \
  --root . \
  --root ../closure-library \
  -o compiled \
  -c ../closure-compiler/compiler.jar \
  -f --compilation_level=ADVANCED_OPTIMIZATIONS \
  --output_file=embedly.min.js \
  -f --closure_entry_point=embedly.Api
