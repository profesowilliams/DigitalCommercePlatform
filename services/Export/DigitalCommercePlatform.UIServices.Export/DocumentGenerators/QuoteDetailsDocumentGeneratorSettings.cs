//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Abstract;
using OfficeOpenXml.Style;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators
{
    [ExcludeFromCodeCoverage]
    public class QuoteDetailsDocumentGeneratorSettings 
        : DocumentGeneratorSettingsBase, IQuoteDetailsDocumentGeneratorSettings
    {
        public string WorkSheetName { get; set; } = "Quote Details";

        public QuoteDetailsDocumentGeneratorSettings()
        {
            
        }
    }
}
