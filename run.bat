@echo off
:: Harborline Account Forms — Dev server
:: Double-click this file OR run it from any terminal.
:: Then open http://localhost:8080 in your browser.
:: Press Ctrl+C to stop.

cd /d "%~dp0"
echo.
echo Starting Harborline dev server...
echo Open http://localhost:8080 in your browser.
echo Press Ctrl+C to stop.
echo.

python -m http.server 8080 --bind 127.0.0.1
pause
