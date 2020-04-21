@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: setx64Release.bat
rem # Author: jhudak
rem # Description: Launches the developer command prompt of the stated configuration
rem #
rem # Required Parameters: NONE
rem # Example Usage:       DIFF
rem #                      
rem ################################################################################


rem STEP INTO ELEVATION PROMPT
rem ################################################################################
REM  --> Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"


rem STEP INTO VSIDE PROMPT
rem ################################################################################
CALL "C:\Program Files (x86)\Microsoft Visual Studio\2017\Professional\VC\Auxiliary\Build\vcvarsamd64_x86.bat" 
CALL "C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\VC\Auxiliary\Build\vcvarsamd64_x86.bat" 
CALL "C:\Program Files (x86)\Microsoft Visual Studio\2017\Enterprise\VC\Auxiliary\Build\vcvarsamd64_x86.bat" 
echo.
echo.

rem STEP INTO SETENV PROMPT
rem ################################################################################
cmd /k .\setenv.cmd x64 Debug
cd ..\..\
