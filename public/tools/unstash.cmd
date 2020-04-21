@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: unstash.cmd
rem # Author: jhudak
rem # Description: Performs a git stash pop operation. Only supports 1 stash. 
rem #
rem # Required Parameters: NONE
rem # Example Usage:       UNSTASH
rem #                      
rem ################################################################################

IF [%1] EQU [] ( GOTO EXECUTE )

IF /I "%1" EQU "/?" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )


rem EXECUTE
rem ################################################################################
:EXECUTE
git stash pop


rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo STASH.CMD - Performs a git stash pop operation. Equivalent to "git stash pop"
@Echo.
@Echo Example Usage: UNSTASH
@Echo.

