#!/bin/bash

# Polyfolio Project Setup Script
# Executa setup inicial do projeto com TypeScript, ESLint, Prettier e Husky

set -e

echo "🚀 Starting Polyfolio setup..."
echo ""

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node -v)
echo "   Node.js version: $node_version"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed!"
echo ""

# Setup Husky
echo "🔐 Setting up Git hooks with Husky..."
npm run prepare
echo "✅ Husky configured!"
echo ""

# Type checking
echo "🔍 Running type check..."
npm run type-check
echo "✅ Type check passed!"
echo ""

# Linting
echo "🎨 Running ESLint..."
npm run lint
echo "✅ Linting passed!"
echo ""

# Format code
echo "✨ Formatting code with Prettier..."
npm run format
echo "✅ Code formatted!"
echo ""

# Create .env.local
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "✅ .env.local created!"
else
  echo "⚠️  .env.local already exists"
fi
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review .env.local if needed"
echo "  2. Run 'npm run dev' to start development server"
echo "  3. Open http://localhost:5173"
echo ""
echo "Useful commands:"
echo "  npm run dev       - Start development server"
echo "  npm run build     - Build for production"
echo "  npm run test      - Run tests"
echo "  npm run lint:fix  - Fix linting issues"
echo ""
