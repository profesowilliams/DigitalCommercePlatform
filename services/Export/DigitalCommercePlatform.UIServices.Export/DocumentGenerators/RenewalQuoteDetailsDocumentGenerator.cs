//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Abstract;
using DigitalCommercePlatform.UIServices.Export.Models.Renewal.Internal;
using OfficeOpenXml;
using System;
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
        protected IRenewalQuoteDetailsDocumentModel Model { get; private set; }

        public ExcelWorksheet Worksheet { get; set; }

        private const int _col = 2;
        private const int _row = 2;

        private static readonly string[] LINE_ITEM_COLUMN_NAMES = {
            "Line", "Product family", "Description", "Serial №", "Instance", "Vendor part №",
            "Qty", "Unit Price (USD)", "Total Price" };

        public RenewalQuoteDetailsDocumentGenerator(IRenewalQuoteDetailsDocumentGeneratorSettings settings)
        {
            Settings = settings;
        }

        public override Task<byte[]> XlsGenerate(IRenewalQuoteDetailsDocumentModel model)
        {
            Model = model;

            using var p = new ExcelPackage();
            Worksheet = p.Workbook.Worksheets.Add(Settings.WorkSheetName);
            p.Workbook.Worksheets.MoveToStart(Settings.WorkSheetName);

            int currentRow = _row;
            currentRow += LogoSection(currentRow);
            currentRow++;
            currentRow += HeaderSection(currentRow);
            currentRow++;
            currentRow += LineDetailsSection(currentRow);
            currentRow++;
            currentRow += TotalSection(currentRow);
            currentRow++;
            OuterBorder(currentRow);
            ColumnsAdjustments();

            return Task.FromResult(p.GetAsByteArray());
        }

        private void ColumnsAdjustments()
        {
            for (int i = _col; i < _col + LINE_ITEM_COLUMN_NAMES.Length; i++)
            {
                Worksheet.Column(_col).Style.WrapText = false;
            }

            Worksheet.Cells[Worksheet.Dimension.Address].AutoFitColumns();
        }

        private void OuterBorder(int height)
        {
            using var range = Worksheet.Cells[_row, _col, height, _col + LINE_ITEM_COLUMN_NAMES.Length - 1];
            range.Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Medium);
        }

        private int TotalSection(int startRow)
        {
            int startCol = _col + LINE_ITEM_COLUMN_NAMES.Length - 2;

            BoldSectionHeader(startRow, startCol, "Total");

            LabelValue(startRow + 1, startCol, "Subtotal", "?" + Model.Price.ToString());
            LabelValue(startRow + 2, startCol, "Tax", "?" + "-");
            LabelValue(startRow + 3, startCol, "Freight", "?" + "-");
            LabelValue(startRow + 4, startCol, "Other fees", "?" + "-");
            LabelValue(startRow + 5, startCol, "Total", "?" + Model.Price.ToString());

            LabelValue(startRow + 7, startCol, "Prices displayed in USD", "");
            StyleTotalSection(startRow, startCol);

            return 8;
        }

        private void StyleTotalSection(int startRow, int startCol)
        {
            var range = Worksheet.Cells[startRow + 7, startCol, startRow + 7, startCol + 1];
            range.Merge = true;
            range.Style.Font.Italic = true;
            range.Style.Font.Size = Settings.CellFontSize - 2;
        }

        private int LineDetailsSection(int startRow)
        {
            var height = LineDetailsHeader(startRow);
            for (int i = 1; i < Model.Items.Count + 1; i++)
            {
                ItemModel item = Model.Items[i - 1];
                LineDetails(startRow, i, item);
            }
            height += Model.Items.Count;
            return height;
        }

        private void LineDetails(int startRow, int i, ItemModel item)
        {
            Worksheet.Cells[startRow + i, _col].Value = i;
            Worksheet.Cells[startRow + i, _col + 1].Value = item.Product[0].Family;
            Worksheet.Cells[startRow + i, _col + 2].Value = "?";

            var serialNr = item.SerialNumbers?.Count > 0 ? item.SerialNumbers[0] : "-";
            Worksheet.Cells[startRow + i, _col + 3].Value = serialNr;
            Worksheet.Cells[startRow + i, _col + 4].Value = item.Instance;
            Worksheet.Cells[startRow + i, _col + 5].Value = "?";
            Worksheet.Cells[startRow + i, _col + 6].Value = item.Quantity;
            Worksheet.Cells[startRow + i, _col + 7].Value = item.UnitPrice;
            Worksheet.Cells[startRow + i, _col + 8].Value = item.TotalPrice;
        }

        private int LineDetailsHeader(int startRow)
        {
            for (int i = 0; i < LINE_ITEM_COLUMN_NAMES.Length; i++)
            {
                Worksheet.Cells[startRow, _col + i].Value = LINE_ITEM_COLUMN_NAMES[i];
            }

            using var range = Worksheet.Cells[startRow, _col, startRow, _col + LINE_ITEM_COLUMN_NAMES.Length - 1];
            range.Style.Border.BorderAround(Settings.DefaultBorder);
            range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Settings.DefaultBackgroundColor);
            range.Style.Font.Name = Settings.FontName;

            return 1;
        }

        private int HeaderSection(int startRow)
        {
            int startCol = _col;
            int height = BasicInformationSection(startRow, startCol);
            height = Math.Max(height, ResellerSection(startRow, startCol + 3));
            height = Math.Max(height, EndUserSection(startRow, startCol + 5));
            height = Math.Max(height, AgreementInformationSection(startRow, startCol + 7));

            return height;
        }

        private int AgreementInformationSection(int startRow, int startCol)
        {
            BoldSectionHeader(startRow, startCol, "Agreement Information");

            LabelValue(startRow + 1, startCol, "Agreement №", "?");
            LabelValue(startRow + 2, startCol, "Vendor quote №", "?");
            LabelValue(startRow + 3, startCol, "Program", "?" + Model.ProgramName);
            LabelValue(startRow + 4, startCol, "Duration", "?");
            LabelValue(startRow + 5, startCol, "Support level", "?" + Model.Level);
            LabelValue(startRow + 6, startCol, "Agreement start-end date", "?");
            LabelValue(startRow + 7, startCol, "Usage start-end date", "?");

            VerticalSegmentLine(startRow, startCol, 7);

            return 8;
        }

        private int EndUserSection(int startRow, int startCol)
        {
            BoldSectionHeader(startRow, startCol, "End User");

            LabelValue(startRow + 1, startCol, "Company name", "my val");
            LabelValue(startRow + 2, startCol, "Name", Model.EndUser.Name);

            var addressLines = $"{Model.EndUser.Address.Line1} {Model.EndUser.Address.Line2} {Model.EndUser.Address.Line3}";
            LabelValue(startRow + 3, startCol, "Address", addressLines);

            var locationData = $"{Model.EndUser.Address.City} {Model.EndUser.Address.State} {Model.EndUser.Address.PostalCode}";
            LabelValue(startRow + 4, startCol, "City, State, Zip code", locationData);
            LabelValue(startRow + 5, startCol, "Country", Model.EndUser.Address.Country);

            var contact = Model.Reseller.Contact.Count > 0
                ? Model.Reseller.Contact[0] : null;
            LabelValue(startRow + 6, startCol, "Phone", contact?.Phone ?? "-");
            LabelValue(startRow + 7, startCol, "Email", contact?.Email ?? "-");

            VerticalSegmentLine(startRow, startCol, 7);

            return 8;
        }

        private int ResellerSection(int startRow, int startCol)
        {
            BoldSectionHeader(startRow, startCol, "Reseller");

            LabelValue(startRow + 1, startCol, "Company name", "?");
            LabelValue(startRow + 2, startCol, "Reseller name", Model.Reseller.Name);

            var addressLines = $"{Model.Reseller.Address.Line1} {Model.Reseller.Address.Line2} {Model.Reseller.Address.Line3}";
            LabelValue(startRow + 3, startCol, "Address", addressLines);

            var locationData = $"{Model.Reseller.Address.City} {Model.Reseller.Address.State} {Model.Reseller.Address.PostalCode}";
            LabelValue(startRow + 4, startCol, "City, State, Zip code", locationData);
            LabelValue(startRow + 5, startCol, "Country", Model.Reseller.Address.Country);

            var contact = Model.Reseller.Contact.Count > 0
                ? Model.Reseller.Contact[0] : null;
            LabelValue(startRow + 6, startCol, "Phone", contact?.Phone ?? "-");
            LabelValue(startRow + 7, startCol, "Email", contact?.Email ?? "-");

            VerticalSegmentLine(startRow, startCol, 7);
            return 8; //height
        }

        private void BoldSectionHeader(int row, int col, string value)
        {
            Worksheet.Cells[row, col].Value = value;
            Worksheet.Cells[row, col].Style.Font.Size = Settings.CellFontSize;
            Worksheet.Cells[row, col].Style.Font.Name = Settings.FontName;
            Worksheet.Cells[row, col].Style.Font.Bold = true;
        }

        private void VerticalSegmentLine(int row, int col, int length)
        {
            using var range = Worksheet.Cells[row, col, row + length, col];
            range.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Medium;
        }

        private int BasicInformationSection(int startRow, int startCol)
        {
            LabelValue(startRow, startCol, "Quote expiry date", "?");
            LabelValue(startRow + 1, startCol, "Quote due date", Model.DueDate.ToShortDateString());
            LabelValue(startRow + 2, startCol, "Ref №", "?");
            LabelValue(startRow + 3, startCol, "End user previous order №", "?");

            return 4;
        }

        private int LogoSection(int startRow)
        {
            var logo = GetTdLogo();
            if (logo != null)
            {
                using var imgRange = Worksheet.Cells[startRow, _col, startRow, _col + 1];
                imgRange.Merge = true;

                OfficeOpenXml.Drawing.ExcelPicture pic = Worksheet.Drawings.AddPicture("LOGO", logo);
                pic.SetSize(100);
                pic.From.Row = startRow;
                pic.From.Column = _col;
                //pic.To.Column = _col + 1;
                pic.SetPosition(startRow - 1, 10, _col - 1, 60);
                imgRange.Worksheet.Row(startRow).Height = logo.PhysicalDimension.Height + 2;// 66;
            }

            return 1;
        }

        private void LabelValue(int row, int col, string label, string value)
        {
            if (!string.IsNullOrWhiteSpace(label))
            {
                Worksheet.Cells[row, col].Value = label;
                Worksheet.Cells[row, col].Style.Font.Size = Settings.CellFontSize;
                Worksheet.Cells[row, col].Style.Font.Name = Settings.FontName;
            }

            if (!string.IsNullOrWhiteSpace(value))
            {
                Worksheet.Cells[row, col + 1].Value = value;
                Worksheet.Cells[row, col + 1].Style.Font.Size = Settings.CellFontSize;
                Worksheet.Cells[row, col + 1].Style.Font.Name = Settings.FontName;
            }
        }

    }
}
