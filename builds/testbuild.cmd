@Echo OFF

rem ################################################################################
rem # Copyright 2012 All Hands
rem # File: testbuild.cmd
rem # Author: jhudak
rem # Description: Runs an enterprise build, by emulating the TFS build environment
rem #              This is a private test script for use only by the build master
rem #
rem # Required Parameters: NONE
rem # Example Usage:       testbuild.cmd nightlybuild.proj
rem #                      
rem ################################################################################

IF [%1] EQU [] ( GOTO EXECUTE )
IF "%1" EQU "/?" ( GOTO DISPLAYHELP )

IF /I "%1" EQU "help" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )


rem EXECUTE
rem ################################################################################
:EXECUTE
msbuild %1 

GOTO:EOF


rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo TESTBUILD.CMD - Runs an enterprise build, by emulating the TFS server parameters
@Echo.
@Echo Example Usage: testbuild.cmd nightlybuild.proj
@Echo.