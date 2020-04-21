@Echo OFF

rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: build.cmd
rem # Author: jhudak
rem # Description: Builds the current directory in the source tree.
rem #
rem # Required Parameters: NONE
rem # Example Usage:       BUILD
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
msbuild /maxcpucount:%NUMBER_OF_PROCESSORS% /p:BuildProjectReferences=false /ignoreprojectextensions:.dbproj,.vbproj,.vcproj,.vxxproj,.sln %1 /p:BuildType=%BUILD_PLATFORM% /p:BuildConfiguration=%BUILD_CONFIGURATION% /p:Platform=%BUILD_PLATFORM% /p:Configuration=%BUILD_CONFIGURATION% /p:BuildContext=%BUILD_CONTEXT%
GOTO:EOF

rem BUILDCLEAN
rem ################################################################################
:BUILDCLEAN
msbuild /maxcpucount:%NUMBER_OF_PROCESSORS% /p:BuildProjectReferences=false /ignoreprojectextensions:.dbproj,.vbproj,.vcproj,.vxxproj,.sln /t:restore;clean;build /p:BuildType=%BUILD_PLATFORM% /p:BuildConfiguration=%BUILD_CONFIGURATION% /p:Platform=%BUILD_PLATFORM% /p:Configuration=%BUILD_CONFIGURATION%  /p:BuildContext=%BUILD_CONTEXT%
GOTO:EOF

rem DISPLAY HELP
rem ################################################################################
:DISPLAYHELP
@Echo.
@Echo BUILD.CMD - Builds the current directory in the source tree.
@Echo.
@Echo Example Usage: BUILD
@Echo.



