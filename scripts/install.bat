@echo off
REM Assuming you've installed PHP, MariaDB and Node.JS

cd ..\api && echo. && echo Running php spark install... && php spark install && cd ..\web && echo. && echo Running npm install... && npm install && cd ..\scripts && echo. && echo Project installation finished! You can close this window. && pause
