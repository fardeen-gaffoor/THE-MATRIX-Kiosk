@echo off
echo Starting Kiosk Mode...

:: Restart on crash loop
:loop
echo Launching Chromium...
:: Flags for kiosk mode: fullscreen, disable translation UI, disable touch pinch/zoom
start /wait msedge.exe --kiosk http://localhost:5173/?kiosk=1 --edge-kiosk-type=fullscreen --no-first-run --disable-pinch --overscroll-history-navigation=0 --disable-features=Translate
echo Browser crashed or closed. Restarting in 5 seconds...
timeout /t 5
goto loop
