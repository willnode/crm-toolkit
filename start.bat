@echo off
REM Assuming you've done Database Migration and NPM Install....

cd api
start "" php spark serve
cd ..\web
start "" npm start