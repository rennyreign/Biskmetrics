#!/bin/bash
set -e

echo "🔍 Running pre-commit quality checks..."
echo ""

# Format check
echo "📝 Checking code formatting..."
npm run format:check

# Lint
echo "🔎 Running linter..."
npm run lint

# Type check
echo "📘 Type checking..."
npm run typecheck

# Tests
echo "🧪 Running tests..."
npm run test

echo ""
echo "✅ All quality checks passed!"
