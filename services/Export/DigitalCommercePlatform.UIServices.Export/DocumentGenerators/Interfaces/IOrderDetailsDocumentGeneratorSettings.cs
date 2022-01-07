//2022 (c) Tech Data Corporation -. All Rights Reserved.
using OfficeOpenXml.Style;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces
{
    public interface IOrderDetailsDocumentGeneratorSettings : IDocumentGeneratorSettings
    {
        string WorkSheetName { get; set; }

        int HeaderRowHeight { get; set; }
        ExcelVerticalAlignment HeaderVerticalAlignment { get; set; }
        string HeaderFontName { get; set; }
        int HeaderFontSize { get; set; }

        string CellFontName { get; set; }
        int CellFontSize { get; set; }
    }
}
