@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: stash.cmd
rem # Author: jhudak
rem # Description: Performs a git stash operation
rem #
rem # Required Parameters: NONE
rem # Example Usage:       STASH
rem #                      
rem ################################################################################

IF [%1] EQU [] ( GOTO EXECUTE )

IF /I "%1" EQU "/?" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )


rem EXECUTE
rem ################################################################################
:EXECUTE
git stash


rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo STASH.CMD - Performs a git stash operation. Equivalent to GIT STASH
@Echo.
@Echo Example Usage: STASH
@Echo.

