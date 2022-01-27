//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Abstract;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators
{
    public class RenewalQuoteDetailsDocumentGeneratorSettings 
        : DocumentGeneratorSettingsBase, IRenewalQuoteDetailsDocumentGeneratorSettings
    {
        public string WorkSheetName { get; set; } = "Renewal Quote Details";
    }
}
