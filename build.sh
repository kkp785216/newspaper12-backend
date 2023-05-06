#!/bin/bash

# Install dependencies
npm install

# Build the code
npm run build

# Remove dev dependencies
npm prune --production

# Remove scripts from package.json
jq 'del(.scripts)' package.json > package-temp.json
mv package-temp.json package.json

# Copy the necessary files and folders to the gh-pages directory
mkdir -p gh-pages
cp package.json gh-pages/
cp vercel.json gh-pages/
cp -r dist gh-pages/
