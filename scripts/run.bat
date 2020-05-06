@echo off
REM Assuming you've done install.bat

cd ..\api
start "" php spark serve
cd ..\web
start "" npm start
cd ..\scripts