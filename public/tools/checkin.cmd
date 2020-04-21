@Echo OFF
rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: checkin.cmd
rem # Author: jhudak
rem # Description: Initates the check-in process using the git commit -m
rem #
rem ################################################################################


IF [%1] EQU [] ( GOTO EXECUTE )

IF /I "%1" EQU "/?" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )
IF /I "%1" EQU "/help" ( GOTO DISPLAYHELP )


rem EXECUTE
rem ################################################################################
:EXECUTE
git commit -m %1

GOTO:EOF

rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo CHECKIN.CMD - Checks in offline changes to the remote repository. Equivalent to git commit -m
@Echo.
@Echo Example Usage: checkin
@Echo.



