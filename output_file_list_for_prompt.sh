#!/usr/bin/env bash
set -e

pushd . > /dev/null
cd /cygdrive/e/dev/multitimer
trap 'popd > /dev/null' EXIT

fn=./index.html
echo "# $fn"
echo '```html'
cat "$fn"
echo
echo '```'
echo

fn=./app.js
echo "# $fn"
echo '```javascript'
cat "$fn"
echo
echo '```'
echo
