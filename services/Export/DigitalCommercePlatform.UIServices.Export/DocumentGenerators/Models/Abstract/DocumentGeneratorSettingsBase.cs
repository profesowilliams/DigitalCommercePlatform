//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using OfficeOpenXml.Style;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Abstract
{
    [ExcludeFromCodeCoverage]
    public abstract class DocumentGeneratorSettingsBase : IDocumentGeneratorSettings 
    {
        public string FontName { get; set; } = "Lato Regular";
        public int CellFontSize { get; set; } = 11;
        public ExcelBorderStyle DefaultBorder { get; set; } = ExcelBorderStyle.Thin;

        public Color DefaultBackgroundColor { get; set; } = Color.FromArgb(197, 217, 241);
    }
}
