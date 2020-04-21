@Echo OFF
rem ################################################################################
rem # Copyright 2020 Techdata
rem # File: resetenv.cmd
rem # Author: jhudak
rem # Description: Assigns the current platform/configuration to build on
rem #
rem # Required Parameters: %1  Build Platform (x86, x64, IA64, ARM, ARM64, MSIL)
rem #                      %2  Build Configuration (Release, Debug)
rem #
rem # Optional Parameters: %3  Build Context (PRIVATEBUILD, OFFICIALBUILD)
rem #                          Default is PRIVATEBUILD, unless on a build server
rem ################################################################################


rem ################################################################################
rem #
rem # Setup build environment -- Capture Build Environment Configuration/User Input
rem # 
rem ################################################################################

@echo TechData Set Environment
@echo Note: SetEnv must be run from an elevated command prompt.
@Echo.

IF NOT EXIST "..\env\build.common.targets" (@Echo This command must be run from the public\tools folder.)
IF /I [%1] EQU [] ( SET /P BUILD_PLATFORM="Please Enter Build Type (x86, x64, arm, arm64, ia64, anycpu): " ) ELSE ( SET BUILD_PLATFORM=%1 )
IF /I [%2] EQU [] ( SET /P BUILD_CONFIGURATION="Please Enter Build Configuration (Release, Debug): " ) ELSE ( SET BUILD_CONFIGURATION=%2 )
IF /I [%3] EQU [] ( SET BUILD_CONTEXT=PRIVATEBUILD ) ELSE ( SET BUILD_CONTEXT=OFFICIALBUILD )




@Echo.
@Echo.
@echo Setting build environment -- Enterprise (%BUILD_PLATFORM% %BUILD_CONFIGURATION%)
@echo --------------------------------------------------------------
@Echo.
@Echo Elected Build Type: %BUILD_PLATFORM%
@Echo Elected Build Configuration: %BUILD_CONFIGURATION%
@Echo.

rem ################################################################################
rem #
rem # Assign build environment -- Set Build Environment Configuration
rem # 
rem ################################################################################
@Echo .. Assigning Build Configuration..

IF /I %BUILD_PLATFORM% EQU x86 (SET BUILD_PLATFORM=x86)
IF /I %BUILD_PLATFORM% EQU X86 (SET BUILD_PLATFORM=x86)
IF /I %BUILD_PLATFORM% EQU x64 (SET BUILD_PLATFORM=x64)
IF /I %BUILD_PLATFORM% EQU X64 (SET BUILD_PLATFORM=x64)
IF /I %BUILD_PLATFORM% EQU arm (SET BUILD_PLATFORM=ARM)
IF /I %BUILD_PLATFORM% EQU ARM (SET BUILD_PLATFORM=ARM)
IF /I %BUILD_PLATFORM% EQU arm64 (SET BUILD_PLATFORM=ARM64)
IF /I %BUILD_PLATFORM% EQU ARM64 (SET BUILD_PLATFORM=ARM64)
IF /I %BUILD_PLATFORM% EQU ia64 (SET BUILD_PLATFORM=IA64)
IF /I %BUILD_PLATFORM% EQU IA64 (SET BUILD_PLATFORM=IA64)
IF /I %BUILD_PLATFORM% EQU AnyCPU (SET BUILD_PLATFORM=AnyCPU)
IF /I %BUILD_PLATFORM% EQU MSIL (SET BUILD_PLATFORM=AnyCPU)
SET MSBUILD_PROCESSOR=%BUILD_PLATFORM%

IF /I %BUILD_CONFIGURATION% EQU Debug (SET BUILD_CONFIGURATION=Debug)
IF /I %BUILD_CONFIGURATION% EQU DEBUG (SET BUILD_CONFIGURATION=Debug)
IF /I %BUILD_CONFIGURATION% EQU debug (SET BUILD_CONFIGURATION=Debug)
IF /I %BUILD_CONFIGURATION% EQU CHK (SET BUILD_CONFIGURATION=Debug)
IF /I %BUILD_CONFIGURATION% EQU chk (SET BUILD_CONFIGURATION=Debug)

IF /I %BUILD_CONFIGURATION% EQU Retail (SET BUILD_CONFIGURATION=Release)
IF /I %BUILD_CONFIGURATION% EQU RETAIL (SET BUILD_CONFIGURATION=Release)
IF /I %BUILD_CONFIGURATION% EQU retail (SET BUILD_CONFIGURATION=Release)

IF /I %BUILD_CONFIGURATION% EQU Release (SET BUILD_CONFIGURATION=Release)
IF /I %BUILD_CONFIGURATION% EQU RELEASE (SET BUILD_CONFIGURATION=Release)
IF /I %BUILD_CONFIGURATION% EQU release (SET BUILD_CONFIGURATION=Release)
IF /I %BUILD_CONFIGURATION% EQU FRE (SET BUILD_CONFIGURATION=Retail)
IF /I %BUILD_CONFIGURATION% EQU fre (SET BUILD_CONFIGURATION=Retail)


TITLE Enterprise Build Environment (%BUILD_PLATFORM%%BUILD_CONFIGURATION%)


rem ################################################################################
rem #
rem # Setup build environment -- Diagnostics & Script Exit
rem # 
rem ################################################################################

@Echo.
@echo .. Your Build Environment Was Configured As Follows:
@Echo.
@Echo.
@Echo    BUILD_PLATFORM: %BUILD_PLATFORM%
@Echo    BUILD_CONFIGURATION: %BUILD_CONFIGURATION%
@Echo    BUILD_CONTEXT: %BUILD_CONTEXT%
@Echo.

@Echo.
@echo .. Build Environment Configuration Complete!
@Echo.
@Echo.