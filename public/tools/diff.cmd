@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: diff.cmd
rem # Author: jhudak
rem # Description: Displays uncomitted local changes
rem #
rem # Required Parameters: NONE
rem # Example Usage:       DIFF
rem #                      
rem ################################################################################

IF [%1] EQU [] ( GOTO EXECUTE )

IF /I "%1" EQU "/?" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )

rem EXECUTE
rem ################################################################################
:EXECUTE
git diff

GOTO:EOF

rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo DIFF.CMD - DIFF the current branch/repository in the source tree.
@Echo.
@Echo Example Usage: DIFF
@Echo.


