#!/usr/bin/env bash
set -e

output_md() {
  local file=$1
  local lang=$2
  echo "# $file"
  echo
  echo -n '```'
  echo $lang
  cat "$file"
  echo
  echo '```'
  echo
}

pushd . > /dev/null
cd /cygdrive/e/dev/multitimer
trap 'popd > /dev/null' EXIT

output_md "index.html" "html"
output_md "app.js" "javascript"
