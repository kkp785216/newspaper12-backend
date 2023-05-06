#!/bin/bash

# Install dependencies
npm install

# Build the code
npm run build

# Copy the necessary files and folders to the dist directory
mkdir -p gh-pages
cp package.json gh-pages/
cp verce.json gh-pages/
cp -r dist gh-pages/