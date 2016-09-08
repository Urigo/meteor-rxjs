#!/bin/sh
mv -f .node_modules node_modules
npm run build
mv -f node_modules .node_modules
cd tests
meteor npm install
linklocal
meteor test --driver-package=practicalmeteor:mocha
