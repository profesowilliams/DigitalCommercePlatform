@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: restore.cmd
rem # Author: jhudak
rem # Description: Restores nuget packages in the source tree
rem #
rem # Required Parameters: NONE
rem # Example Usage:       RESTORE
rem #                      
rem ################################################################################

IF [%1] EQU [] ( GOTO EXECUTE )

IF /I "%1" EQU "/?" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )


rem EXECUTE
rem ################################################################################
:EXECUTE
msbuild /t:restore /p:BuildProjectReferences=false /ignoreprojectextensions:.dbproj,.vbproj,.vcproj,.vcxproj,.sln   /p:BuildType=%BUILD_TYPE% /p:BuildConfiguration=%BUILD_CONFIGURATION% /p:Platform=%BUILD_PLATFORM% /p:Configuration=%BUILD_CONFIGURATION%
GOTO:EOF

rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo RESTORE.CMD - Restores nuget packages in the source tree
@Echo.
@Echo Example Usage: CLEAN
@Echo.



