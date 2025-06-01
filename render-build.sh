#!/usr/bin/env bash

# fail the script on error
set -e

# install and build client
cd client
npm install
npm run build
cd ..

# install server/root dependencies
npm install
