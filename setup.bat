@echo off
REM Polyfolio Project Setup Script for Windows
REM Executa setup inicial do projeto

echo 🚀 Starting Polyfolio setup...
echo.

REM Check Node.js version
echo 📋 Checking Node.js version...
node -v
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call pnpm install
if errorlevel 1 (
  echo ❌ Failed to install dependencies
  exit /b 1
)
echo ✅ Dependencies installed!
echo.

REM Setup Husky
echo 🔐 Setting up Git hooks with Husky...
call pnpm run prepare
echo ✅ Husky configured!
echo.

REM Type checking
echo 🔍 Running type check...
call pnpm run type-check
if errorlevel 1 (
  echo ❌ Type check failed
  exit /b 1
)
echo ✅ Type check passed!
echo.

REM Linting
echo 🎨 Running ESLint...
call npm run lint
if errorlevel 1 (
  echo ❌ Linting failed
  exit /b 1
)
echo ✅ Linting passed!
echo.

REM Format code
echo ✨ Formatting code with Prettier...
call pnpm run format
echo ✅ Code formatted!
echo.

REM Create .env.local
if not exist .env.local (
  echo 📝 Creating .env.local from .env.example...
  copy .env.example .env.local
  echo ✅ .env.local created!
) else (
  echo ⚠️  .env.local already exists
)
echo.

echo 🎉 Setup complete!
echo.
echo Next steps:
echo   1. Review .env.local if needed
echo   2. Run 'npm run dev' to start development server
echo   3. Open http://localhost:5173
echo.
echo Useful commands:
echo   npm run dev       - Start development server
echo   npm run build     - Build for production
echo   npm run test      - Run tests
echo   npm run lint:fix  - Fix linting issues
echo.
