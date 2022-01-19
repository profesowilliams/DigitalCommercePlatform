//2022 (c) Tech Data Corporation -. All Rights Reserved.

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces
{
    public interface IQuoteDetailsDocumentGeneratorSettings : IDocumentGeneratorSettings
    {
        string WorkSheetName { get; set; }
    }
}
