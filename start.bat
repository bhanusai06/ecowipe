@echo off
echo Starting EcoWipe Development Environment...

echo Checking MongoDB...
mongod --version > nul 2>&1
if errorlevel 1 (
    echo [WARNING] MongoDB is not installed locally. Continuing since the app connects to MongoDB Atlas cloud.
)

echo Starting application...
cd /d "%~dp0"
npm run dev