#!/bin/bash

# Clear all npm caches
echo "🧹 Clearing npm caches..."
git checkout -- package-lock.json

# Clear all composer caches
echo "🧹 Clearing composer caches..."
git checkout -- composer.lock


echo "✅ Optimization complete!"
