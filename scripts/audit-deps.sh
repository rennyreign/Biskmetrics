#!/bin/bash
set -e

echo "🔒 Running dependency security audit..."
echo ""

# Run npm audit
npm audit --audit-level=moderate

echo ""
echo "✅ Dependency audit complete!"
