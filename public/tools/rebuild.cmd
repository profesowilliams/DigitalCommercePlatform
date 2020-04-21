@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: rebuild.cmd
rem # Author: jhudak
rem # Description: Performs a clean followed by a build
rem #
rem # Required Parameters: NONE
rem # Example Usage:       REBUILD
rem #                      
rem ################################################################################


IF [%1] EQU [] ( GOTO EXECUTE )
IF "%1" EQU "/?" ( GOTO DISPLAYHELP )

IF /I "%1" EQU "help" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )

IF /I "%1" EQU "clean" ( GOTO BUILDCLEAN )
IF /I "%1" EQU "/clean" ( GOTO BUILDCLEAN )


rem EXECUTE
rem ################################################################################
:EXECUTE
BUILD CLEAN
GOTO:EOF


rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo BUILD.CMD - Rebuilds the current directory in the source tree. Performs a clean followed by a build.
@Echo.
@Echo Example Usage: REBUILD
@Echo.


