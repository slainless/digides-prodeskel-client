#!/bin/bash

# prepending directive to every js files
for file in ./dist/**/*.js
do
    file_name=$(basename ${file} | sed 's/\.js$//')

    if [ -f "$(echo ${file} | sed 's/\.js$/\.d\.ts/')" ]; then
      echo "/// <reference types=\"./${file_name}.d.ts\" />" | cat - ${file} > ${file}.tmp && mv ${file}.tmp ${file}
    fi
done
