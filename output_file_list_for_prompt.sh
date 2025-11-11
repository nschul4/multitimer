#!/usr/bin/env bash
set -e

pushd . > /dev/null
cd /cygdrive/e/dev/multitimer
trap 'popd > /dev/null' EXIT

export MYSCRIPTS_LIB=~/dev/bash/sh/lib
source "$MYSCRIPTS_LIB/lib1.sh"

output_md "index.html" "html"
output_md "app.js" "javascript"
