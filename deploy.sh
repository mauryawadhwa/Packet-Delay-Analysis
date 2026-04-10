#!/bin/bash

# Build the React frontend
cd frontend
npm install
npm run build

# Create the static directory in backend if it doesn't exist
mkdir -p ../backend/static

# Copy the build files to the backend's static directory
cp -r build/* ../backend/static/

cd ..
echo "Frontend build complete and copied to backend/static"
echo "You can now deploy the backend directory to your hosting provider"
