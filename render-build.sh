#!/usr/bin/env bash
set -o errexit

echo "🔧 Installing root dependencies"
npm install

echo "🔧 Building client"
cd client
npm install
npm run build
cd ..

echo "🚀 Build complete"
