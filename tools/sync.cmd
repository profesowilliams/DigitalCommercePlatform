@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: clean.cmd
rem # Author: jhudak
rem # Description: Syncronizes the current branch / repository with the remote
rem #
rem # Required Parameters: NONE
rem # Example Usage:       SYNC
rem #                      
rem ################################################################################

IF [%1] EQU [] ( GOTO EXECUTE )

IF /I "%1" EQU "/?" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )

rem EXECUTE
rem ################################################################################
:EXECUTE
git pull
git push

GOTO:EOF

rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo SYNC.CMD - SYNCS the current branch/repository in the source tree.
@Echo.
@Echo Example Usage: SYNC
@Echo.


