#!/bin/bash

bunx esbuild ./src/browser/index.js \
  --bundle --platform=browser --format=iife --minify \
  --global-name=prodeskelws \
  --outfile=dist/browser.min.js