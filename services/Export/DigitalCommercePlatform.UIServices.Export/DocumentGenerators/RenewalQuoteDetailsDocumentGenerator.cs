//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Abstract;
using OfficeOpenXml;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators
{
    [ExcludeFromCodeCoverage]
    public class RenewalQuoteDetailsDocumentGenerator :
        DocumentGeneratorBase<IRenewalQuoteDetailsDocumentGeneratorSettings, IRenewalQuoteDetailsDocumentModel>,
        IRenewalQuoteDetailsDocumentGenerator
    {
        protected override IRenewalQuoteDetailsDocumentGeneratorSettings Settings { get; set; }

        public ExcelWorksheet Worksheet { get; set; }

        private int _col = 2;
        private int _row = 2;

        public RenewalQuoteDetailsDocumentGenerator(IRenewalQuoteDetailsDocumentGeneratorSettings settings)
        {
            Settings = settings;
        }

        public override Task<byte[]> XlsGenerate(IRenewalQuoteDetailsDocumentModel model)
        {
            using var p = new ExcelPackage();
            Worksheet = p.Workbook.Worksheets.Add(Settings.WorkSheetName);
            p.Workbook.Worksheets.MoveToStart(Settings.WorkSheetName);

            ExcelRange rng = Worksheet.Cells[_row, _col, _row, _col + 2];
            rng.Merge = true;
            rng.Value = $"Quote ID: {model.Id}";
            rng.Style.Font.Size = Settings.CellFontSize;
            rng.Style.Font.Name = Settings.FontName;
            rng.Style.Border.BorderAround(Settings.DefaultBorder);
            Worksheet.Cells[_row, _col].Style.WrapText = false;

            Worksheet.Column(_col).AutoFit();
            return Task.FromResult(p.GetAsByteArray());
        }

    }
}
