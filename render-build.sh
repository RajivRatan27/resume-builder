#!/usr/bin/env bash
set -o errexit

# Install dependencies in root and client
echo "🔧 Installing dependencies"
npm install
cd client && npm install
cd ..

# Build the client
echo "🔧 Building client"
cd client && npm run build
cd ..

# Build server (if needed)
echo "🔧 Building server"
npm run build:server

echo "🚀 Build complete"