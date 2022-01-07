//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using OfficeOpenXml.Style;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators
{
    [ExcludeFromCodeCoverage]
    public class OrderDetailsDocumentGeneratorSettings : IOrderDetailsDocumentGeneratorSettings
    {
        public string WorkSheetName { get; set; } = "Order Details";

        public int HeaderRowHeight { get; set; } = 66;
        public ExcelVerticalAlignment HeaderVerticalAlignment { get; set; } = ExcelVerticalAlignment.Bottom;
        public string HeaderFontName { get; set; } = "Lato Regular";
        public int HeaderFontSize { get; set; } = 22;

        public string CellFontName { get; set; } = "Calibri";
        public int CellFontSize { get; set; } = 11;
    }
}
