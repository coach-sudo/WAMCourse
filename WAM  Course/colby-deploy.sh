#!/usr/bin/env bash
set -euo pipefail
rm -rf colby-dist
mkdir -p colby-dist
python3 -m zipfile -e colby-trainer-v2.zip colby-dist
test -f colby-dist/colby-trainer/index.html
