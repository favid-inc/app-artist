#!/usr/bin/env bash

env=${1}
cp ./config/${env}.env.js ./config/index.js
cp ./src/core/config/${env}.env.ts ./src/core/config/index.ts
