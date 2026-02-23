#!/bin/bash
set -e

echo "🚀 Biskmetrics Setup Script"
echo "============================"
echo ""

# Check Node version
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo "✓ Node.js detected: $NODE_VERSION"
else
  echo "❌ Node.js not found. Please install Node.js 24.11.1"
  exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  echo ""
  echo "📝 Creating .env file from .env.example..."
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "✓ .env created. Please update with your credentials."
  else
    echo "⚠️  No .env.example found. Skipping .env creation."
  fi
fi

# Run quality checks
echo ""
echo "🔍 Running quality checks..."
npm run typecheck
npm run lint
npm run format:check

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env with your configuration (if applicable)"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Run 'npm run test' to run tests"
echo ""
