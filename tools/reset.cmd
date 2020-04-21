@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: reset.cmd
rem # Author: jhudak
rem # Description: Resets the current branch to the state of the specified origin
rem #
rem # Required Parameters: NONE
rem # Example Usage:       RESET master
rem #                      
rem ################################################################################

IF [%1] EQU [] ( GOTO EXECUTE )

IF /I "%1" EQU "/?" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )

rem EXECUTE
rem ################################################################################
:EXECUTE
git reset --hard
git pull --rebase origin %1
git clean -xdf

GOTO:EOF

rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo SYNC.CMD - SYNCS the current branch/repository in the source tree.
@Echo.
@Echo Example Usage: SYNC
@Echo.


