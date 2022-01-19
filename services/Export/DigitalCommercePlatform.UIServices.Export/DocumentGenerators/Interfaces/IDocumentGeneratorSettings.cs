//2022 (c) Tech Data Corporation -. All Rights Reserved.
using OfficeOpenXml.Style;
using System.Drawing;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces
{
    public interface IDocumentGeneratorSettings
    {
        public string FontName { get; set; }
        public int CellFontSize { get; set; }
        public ExcelBorderStyle DefaultBorder { get; set; }
        public Color DefaultBackgroundColor { get; set; }
    }
}
