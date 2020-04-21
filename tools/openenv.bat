@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: openenv.bat
rem # Author: jhudak
rem # Description: Opens all build environments
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



rem LAUNCH BUILD WINDOWS
rem ################################################################################
start .\x86Release.bat
start .\x86Debug.bat
start .\x64Release.bat
start .\x64Debug.bat


