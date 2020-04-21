@if (1 == 0) @end /*
@echo off
setlocal enableextensions

if "%1" EQU "" echo Usage: viewLog ^<logfile^> & goto :eof

rem Find the closest path to Wex.Logger
set fullPath=%~dp0;%cd%;%path%
for %%v in (wex.logger.dll) do set wlPath=%%~f$fullPath:v
if "%wlPath%" EQU "" echo ViewLog: Wex.Logger.dll was not found in your path.  Unable to render the log file. & goto :eof

@cscript.exe //E:jscript //nologo "%~f0" %wlPath% %*
@goto :eof
*/
var g_fso = new ActiveXObject("Scripting.FileSystemObject");
var g_ws = new ActiveXObject("WScript.Shell");

function LoadXmlFile(filePath)
{
    var xmlFile = new ActiveXObject("Msxml2.DOMDocument.3.0");
    xmlFile.async = false;
    xmlFile.load(filePath);

    if (xmlFile.parseError.errorCode != 0)
    {
        throw "Error parsing '" + filePath + "': " +  xmlFile.parseError.reason;
    }

    return xmlFile;
}

function SaveTempFile(fileText)
{
   // Get the temp folder and create a temp file name
   var temporaryFolder = 2;
   var overwrite = true;
   var unicode = true;
   var tempFolder = g_fso.GetSpecialFolder(temporaryFolder);
   var fileName = g_fso.GetTempName() + ".html";

   // Create the temp file and write all html to it
   var textStream = tempFolder.CreateTextFile(fileName, overwrite, unicode);
   textStream.Write(fileText);
   textStream.Close();

   // Return the path to the temp file
   return g_fso.BuildPath(tempFolder.Path, fileName);
}

function Main()
{
    try
    {
        // Find the log file; load it and the stylesheet as xml documents
        var logFile = g_fso.GetFile(WScript.Arguments(1));
        var logFileXml = LoadXmlFile(logFile.Path);
        var stylesheet = LoadXmlFile("res://" + WScript.Arguments(0) + "/SUMMARY_XSL/102");

        // Transform the log file xml, save it to disk as html, and launch it in IE
        WScript.Echo("ViewLog: Transforming the log file...");
        var outputPath = SaveTempFile(logFileXml.transformNode(stylesheet));

        WScript.Echo("ViewLog: Launched results in Internet Explorer.");
        g_ws.Run("iexplore.exe " + outputPath);
    }
    catch (e)
    {
        WScript.Echo("ViewLog: " +  e.toString());
    }    
}

Main();
