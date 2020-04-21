@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: analyze.cmd
rem # Author: jhudak
rem # Description: Analyzes the current directory in the source tree.
rem #
rem # Required Parameters: NONE
rem # Example Usage:       CLEAN
rem #                      
rem ################################################################################

IF [%1] EQU [] ( GOTO EXECUTE )

IF /I "%1" EQU "/?" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )


rem EXECUTE
rem ################################################################################
:EXECUTE
msbuild /t:Analyze /p:BuildProjectReferences=false /ignoreprojectextensions:.dbproj,.vbproj,.vcproj,.vcxproj,.sln /p:BuildType=%BUILD_TYPE% /p:BuildConfiguration=%BUILD_CONFIGURATION% /p:Platform=%BUILD_PLATFORM% /p:Configuration=%BUILD_CONFIGURATION% /p:RunCodeAnalysis=true
GOTO:EOF

rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo ANALYZE.CMD - Runs code analysis on the current directory in the source tree.
@Echo.
@Echo Example Usage: ANALYZE
@Echo.



