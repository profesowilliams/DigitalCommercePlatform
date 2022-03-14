//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Abstract;
using DigitalCommercePlatform.UIServices.Export.Models;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators
{
    [ExcludeFromCodeCoverage]
    public class QuoteDetailsDocumentGenerator :
        DocumentGeneratorBase<IQuoteDetailsDocumentGeneratorSettings, IQuoteDetailsDocumentModel>,
        IQuoteDetailsDocumentGenerator
    {
        protected override IQuoteDetailsDocumentGeneratorSettings Settings { get; set; }

        private const string ORIGINAL_ESTIMATE_ID = "OriginalEstimateId";
        private const string DEAL_IDENTIFIER = "DealIdentifier";
        private const string NA = "N/A";
        private const string PRICE_FORMAT = "{0:$#,##0.00;($#,##0.00);$0.00}";

        private static readonly string[] COLUMNS_TO_EXPORT = { "LINE", "Product Description", "VENDOR PART #", "Start Date", "Auto Renew", "Duration", "Billing", "TECH DATA PART #", "QTY", "LIST PRICE", "ITEM PRICE", "EXTENDED PRICE", " ", " ", " ", " ", " ", " " };

        public ExcelWorksheet Worksheet { get; set; }

        public string OriginalEstimateId { get; set; } = string.Empty;
        public string QuickQuoteDealId { get; set; }
        public string EstimateDealId { get; set; } = string.Empty;
        public bool IsHPEQuote { get; set; }
        public int AncillaryLines { get; set; }
        public bool IsAnnuityPresent { get; set; }

        private int _col = 2;
        private int _row = 2;

        public QuoteDetailsDocumentGenerator(IQuoteDetailsDocumentGeneratorSettings settings)
        {
            Settings = settings;
        }

        public override Task<byte[]> XlsGenerate(IQuoteDetailsDocumentModel quoteDetails)
        {
            using var p = new ExcelPackage();
            Worksheet = p.Workbook.Worksheets.Add(Settings.WorkSheetName);
            p.Workbook.Worksheets.MoveToStart(Settings.WorkSheetName);

            QuickQuoteDealId = quoteDetails.SPAId ?? string.Empty;

            //quote
            GenerateReportHeader();
            GenerateQuoteDetailHeader();
            SetProperties(quoteDetails);
            ApplyMarkup(quoteDetails);
            FillQuoteAndDate(quoteDetails);
            FillHPEEstimateDealId(quoteDetails);
            GenerateNotes(quoteDetails);
            FillQuickQuoteDealId(quoteDetails);
            GenerateResellerSection(quoteDetails);
            GenerateEndUserSection(quoteDetails);
            StyleQuoteSection();
            _row += 5;
            BottomBlankRow();

            //Line subline
            InnerHeaderRange();
            _row += 11;
            GetLineHeader();
            GenerateItemLines(quoteDetails);


            //total
            GenerateTotalSection(quoteDetails);
            int endRow = GenerateTermsAndConditions();

            _row = 2;
            using var outerBorder = Worksheet.Cells[_row + 1, _col, endRow, _col + 14];
            outerBorder.Style.Border.BorderAround(ExcelBorderStyle.Thick);
            Worksheet.Cells[_row + 1, _col, _row + 1, _col + 14].Style.Border.Top.Style = ExcelBorderStyle.None;

            _col = 2;
            SetHeaderImage(_row, _col, Worksheet, quoteDetails.Request.Logo);

            return Task.FromResult(p.GetAsByteArray());
        }

        private int GenerateTermsAndConditions()
        {
            _row += 7 + AncillaryLines;
            GenerateTermsAndConditionsHeader();
            GenerateBasicTermsAndConditions();
            GenerateAnnuityDisclaimer(out int endRow);
            return endRow;
        }

        private void GenerateAnnuityDisclaimer(out int endRow)
        {
            int annuityDisclaimerLines = 0;
            if (IsAnnuityPresent)
            {
                annuityDisclaimerLines = 4;
                for (int i = 6; i <= 9; i++)
                {
                    var termsConditionLines = SetTermsConditionProperties(Worksheet.Cells[_row + i, _col + 1, _row + i, _col + 13]);
                    switch (i)
                    {
                        case 6:
                            termsConditionLines.Value = "(1)   As per Cisco policy, billing begins either when provisioning is complete, or on the 30th day after the Requested Start Date." +
                                            " The associated cost for the initial month will be adjusted to the appropriate prorated charge based on invoice date. Separate subscription usage and modifications will be subject to the terms and pricing of the specific offers.";
                            termsConditionLines.Worksheet.Row(_row + 6).Height = 30;
                            break;
                        case 7:
                            termsConditionLines.Value = "(2)   Cisco recurring XaaS subscriptions can contain metered/consumption based charges based on end customer’s usage." +
                                            " These fees are in addition to the base subscription costs and are billed in arrears based on billing frequency.";
                            break;
                        case 8:
                            termsConditionLines.Value = "(3)   As per Cisco policy, once provisioned, a subscription is not able to be cancelled prior to the end date of the established term.";
                            break;
                        case 9:
                            termsConditionLines.Value = "(4)   The vast majority of Cisco subscriptions are set to auto-renew. If you wish to cancel or modify the subscription prior to the renewal date," +
                                            " Cisco requires at least 30 days advance notice to do so. While Tech Data notifies partners of upcoming renewals 120, 90, and 60 days in advance," +
                                            " it is incumbent on the partner to cancel the renewal or request that Tech Data do so a minimum of 30 days in advance, in accordance with Cisco’s policy. ";
                            termsConditionLines.Worksheet.Row(_row + 9).Height = 30;
                            break;
                    }
                }
            }
            using var conditionRange = Worksheet.Cells[_row + 1, _col + 1, _row + 5 + annuityDisclaimerLines, _col + 13];
            conditionRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);

            //endRow is used later in parent method
            endRow = _row + 6 + AncillaryLines + annuityDisclaimerLines;
        }

        private void GenerateTermsAndConditionsHeader()
        {
            var conditionHeading = Worksheet.Cells[_row + 1, _col + 1, _row + 1, _col + 13];
            conditionHeading.Merge = true;
            conditionHeading.Value = "Terms & Conditions";
            conditionHeading.Style.Font.Name = Settings.FontName;
            conditionHeading.Style.Font.Size = Settings.CellFontSize;
            conditionHeading.Style.Font.Bold = true;
            conditionHeading.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            conditionHeading.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            conditionHeading.Style.Fill.PatternType = ExcelFillStyle.Solid;
            conditionHeading.Style.Fill.BackgroundColor.SetColor(Settings.DefaultBackgroundColor);
            conditionHeading.Worksheet.Row(_row + 1).Height = 22.5;
        }

        private void GenerateBasicTermsAndConditions()
        {
            for (int i = 2; i <= 5; i++)
            {
                var termsConditionLines = SetTermsConditionProperties(Worksheet.Cells[_row + i, _col + 1, _row + i, _col + 13]);
                switch (i)
                {
                    case 2:
                        termsConditionLines.Value = "All prices and descriptions are subject to change without notice.";
                        break;
                    case 3:
                        termsConditionLines.Value = "This price list is a quotation only and is not an order or offer to sell.";
                        break;
                    case 4:
                        termsConditionLines.Value = "No contract for sale will exist unless and until a purchase order has been issued by you and accepted by Tech Data Corporation(“Tech Data”)." +
                                                " Acceptance by Tech Data of any offer is expressly conditioned upon your assent to the Terms and Conditions of Sale set forth in Tech Data’s invoices." +
                                                " The prices contained in this list may not be relied upon as the price at which Tech Data will accept an offer to purchase products unless expressly agreed to by Tech Data in writing." +
                                                " Products quoted were selected by Tech Data based on specifications available at the time of the quotation, and are not guaranteed to meet bid specifications." +
                                                " Product specifications may be changed by the manufacturer without notice. It is your responsibility to verify product conformance to specifications of any subsequent contract. All products are subject to availability from the manufacturer.";
                        termsConditionLines.Worksheet.Row(_row + i).Height = 54;
                        break;
                    case 5:
                        termsConditionLines.Value = "Tech Data is not responsible for compliance with regulations, requirements or obligations associated with any contract resulting from this quotation unless said regulations," +
                                                " requirements or obligations have been passed to Tech Data and approved in writing by an authorized representative of Tech Data.";
                        termsConditionLines.Worksheet.Row(_row + i).Height = 30;
                        break;
                }
            }
        }

        private void SetHeaderImage(int _row, int _col, ExcelWorksheet wsQuoteDetail, string resellerLogoBase64)
        {
            using var imgRange = wsQuoteDetail.Cells[_row, _col + 9, _row, _col + 14];
            imgRange.Merge = true;
            var logo = GetResellerLogo(resellerLogoBase64);
            // If the default logo is not found and no logo has been supplied, leave the area blank
            // but still output the export
            if (logo != null)
            {
                OfficeOpenXml.Drawing.ExcelPicture pic = wsQuoteDetail.Drawings.AddPicture("LOGO", logo);
                pic.SetSize(100);
                pic.From.Column = _col + 9;
                pic.From.Row = _row - 1;
                pic.To.Column = _col + 10;
                pic.SetPosition(_row - 1, 10, _col + 9, 60);
                imgRange.Worksheet.Row(_row).Height = logo.PhysicalDimension.Height + 2;// 66;
            }
            imgRange.Style.Border.BorderAround(Settings.DefaultBorder);
            imgRange.Style.Border.Top.Style = ExcelBorderStyle.Thick;
            imgRange.Style.Border.Right.Style = ExcelBorderStyle.Thick;
        }

        private static Image GetResellerLogo(string logo)
        {
            if (!string.IsNullOrEmpty(logo))
            {
                var buffer = new Span<byte>(new byte[logo.Length]);
                var isValidImage = Convert.TryFromBase64String(logo, buffer, out _);

                if (isValidImage)
                {
                    byte[] bytes = buffer.ToArray();

                    using var ms = new MemoryStream(bytes);
                    return Image.FromStream(ms);
                }
            }

            return GetTdLogo();
        }

        private ExcelRange SetTermsConditionProperties(ExcelRange termsConditionLines)
        {
            termsConditionLines.Merge = true;
            termsConditionLines.Style.Font.Name = Settings.FontName;
            termsConditionLines.Style.Font.Size = 10;
            termsConditionLines.Style.WrapText = true;
            return termsConditionLines;
        }

        private void GenerateTotalSection(IQuoteDetailsDocumentModel quoteDetails)
        {
            decimal totalAmount = quoteDetails.SubTotal;

            using var totalHeading = Worksheet.Cells[_row + 1, _col + 10, _row + 1, _col + 13];
            totalHeading.Merge = true;
            totalHeading.Value = "Total";
            totalHeading.Style.Font.Name = Settings.FontName;
            totalHeading.Style.Font.Size = 10;
            totalHeading.Style.Font.Bold = true;
            totalHeading.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            totalHeading.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
            totalHeading.Style.Fill.PatternType = ExcelFillStyle.Solid;
            totalHeading.Style.Fill.BackgroundColor.SetColor(Settings.DefaultBackgroundColor);

            using var totalHeadingBorder = Worksheet.Cells[_row, _col + 10, _row, _col + 13];
            totalHeadingBorder.Style.Border.Bottom.Style = Settings.DefaultBorder;

            Worksheet.Cells[_row + 3, _col + 11].Value = "Subtotal";
            Worksheet.Cells[_row + 3, _col + 12, _row + 3, _col + 13].Merge = true;
            Worksheet.Cells[_row + 3, _col + 12, _row + 3, _col + 13].Value = quoteDetails.SubTotal > 0
                ? string.Format(PRICE_FORMAT, Math.Round(quoteDetails.SubTotal, 2))
                : "$0.00";

            foreach (AncillaryItem ancillaryItem in quoteDetails.Request.AncillaryItems)
            {
                Worksheet.Cells[_row + 4 + AncillaryLines, _col + 11].Value = $"Ancillary item ({ancillaryItem.Description.Trim()})";
                Worksheet.Cells[_row + 4 + AncillaryLines, _col + 12, _row + 4 + AncillaryLines, _col + 13].Merge = true;
                Worksheet.Cells[_row + 4 + AncillaryLines, _col + 12, _row + 4 + AncillaryLines, _col + 13].Value = ancillaryItem.Value > 0
                    ? string.Format(PRICE_FORMAT, Math.Round(ancillaryItem.Value, 2))
                    : "$0.00";
                AncillaryLines++;
                totalAmount += ancillaryItem.Value;
            }

            var shippingAndHandlingRow = _row + 4 + AncillaryLines;
            var quoteTotalRow = shippingAndHandlingRow;
            if (IsHPEQuote)
            {
                Worksheet.Cells[shippingAndHandlingRow, _col + 11].Value = "Shipping and Handling";
                Worksheet.Cells[shippingAndHandlingRow, _col + 12, shippingAndHandlingRow, _col + 13].Merge = true;
                Worksheet.Cells[shippingAndHandlingRow, _col + 12, shippingAndHandlingRow, _col + 13].Value = "CALL";
                quoteTotalRow++;
            }

            Worksheet.Cells[quoteTotalRow, _col + 11].Value = "Quote Total";
            Worksheet.Cells[quoteTotalRow, _col + 12, quoteTotalRow, _col + 13].Merge = true;
            Worksheet.Cells[quoteTotalRow, _col + 12, quoteTotalRow, _col + 13].Value =
                totalAmount > 0 ? string.Format(PRICE_FORMAT, Math.Round(totalAmount, 2)) : "$0.00";

            using var totalContent = Worksheet.Cells[_row + 3, _col + 10, _row + 9 + AncillaryLines, _col + 13];
            totalContent.Style.Font.Name = Settings.FontName;
            totalContent.Style.Font.Size = Settings.CellFontSize;
            totalContent.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            totalContent.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;


            using var totalRange = Worksheet.Cells[_row + 1, _col + 10, _row + 6 + AncillaryLines, _col + 13];
            totalRange.Style.Border.BorderAround(Settings.DefaultBorder);
        }

        private void GenerateItemLines(IQuoteDetailsDocumentModel quoteDetails)
        {
            if (quoteDetails.Items?.Count > 0)
            {
                foreach (Line line in quoteDetails.Items.OrderBy(i => i.Id))
                {
                    MapLineLevelData(line, _row, EstimateDealId);
                    _row += 1;
                    var subLines = line.Children?.OrderBy(i => i.Id);
                    
                    if (subLines.Any())
                    {
                        foreach (var subLine in subLines)
                        {
                            subLine.IsSubLine = true;
                            MapLineLevelData(subLine, _row, EstimateDealId);
                            _row += 1;
                        }
                    }
                }
            }

            Worksheet.Row(_row).Height = 35;
        }

        private void MapLineLevelData(Line line, int xlRow, string estimateDealId)
        {
            for (int column = 3; column < 15; column++)
            {
                SetCenterAlignment();
            }

            if (!line.IsSubLine && !string.IsNullOrEmpty(line.DisplayLineNumber))
            {
                FillLineNumberData(line);
            }
            else if (line.IsSubLine && !string.IsNullOrEmpty(line.DisplayLineNumber))
            {
                FillSubLineData(line);
            }

            StyleAndInsertRow(xlRow);
        }

        private void FillSubLineData(Line line)
        {
            string[] splitLineNumber = line.DisplayLineNumber.Split('.');
            if (splitLineNumber[splitLineNumber.Length - 1] == "1")
            {
                Worksheet.Cells[_row - 1, 3].Style.Border.Bottom.Style = Settings.DefaultBorder;
            }
            Worksheet.Cells[_row, 3].Value = line.DisplayLineNumber;
            Worksheet.Cells[_row, 3].Style.Numberformat.Format = "0.0";
            Worksheet.Cells[_row, 3].Style.Border.Left.Style = Settings.DefaultBorder;

            Worksheet.Cells[_row, 4].Value = !string.IsNullOrEmpty(line.ShortDescription) ? line.ShortDescription : NOT_AVAILABLE;
            Worksheet.Cells[_row, 5].Value = !string.IsNullOrEmpty(line.VendorPartNo) ? line.VendorPartNo : NOT_AVAILABLE;
            SubLineDataAttributes(line);

            Worksheet.Cells[_row, 10].Value = ConvertTDNumber(line.TDNumber);

            Worksheet.Cells[_row, 11].Value = line.Quantity;
            Worksheet.Cells[_row, 11].Style.Numberformat.Format = "0";

            if (decimal.TryParse(line.UnitListPrice, out decimal listPrice))
            {
                Worksheet.Cells[_row, 12].Value = string.Format(PRICE_FORMAT, listPrice);
            }
            else
            {
                Worksheet.Cells[_row, 12].Value = NA;
            }

            Worksheet.Cells[_row, 13].Value = string.Format(PRICE_FORMAT, line.UnitPrice);
            if (decimal.TryParse(line.ExtendedPrice, out decimal extendedPrice))
            {
                Worksheet.Cells[_row, 14].Value = string.Format(PRICE_FORMAT, extendedPrice);
            }
            else
            {
                Worksheet.Cells[_row, 14].Value = NA;
            }
        }

        private void SubLineDataAttributes(Line line)
        {
            var startDate = line.Attributes?.FirstOrDefault(s => s.Name.Equals("REQUESTEDSTARTDATE"))?.Value;
            Worksheet.Cells[_row, 6].Value = startDate ?? "";

            var autoRenew = line.Attributes?.FirstOrDefault(s => s.Name.Equals("AUTORENEWALTERM"))?.Value;
            Worksheet.Cells[_row, 7].Value = autoRenew ?? "";

            var deal = line.Attributes?.FirstOrDefault(s => s.Name.Equals("DEALDURATION"))?.Value;
            Worksheet.Cells[_row, 8].Value = deal ?? "";

            var billing = line.Attributes?.FirstOrDefault(s => s.Name.Equals("BILLINGTERM"))?.Value;
            Worksheet.Cells[_row, 9].Value = billing ?? "";
        }

        private void FillLineNumberData(Line line)
        {
            Worksheet.Cells[_row, 3].Value = line.DisplayLineNumber;
            Worksheet.Cells[_row, 3].Style.Numberformat.Format = "0.0";
            Worksheet.Cells[_row, 4].Value = !string.IsNullOrEmpty(line.ShortDescription) ? line.ShortDescription : NOT_AVAILABLE;
            Worksheet.Cells[_row, 5].Value = !string.IsNullOrEmpty(line.VendorPartNo) ? line.VendorPartNo : NOT_AVAILABLE;

            FillLineDataAttributes(line);

            Worksheet.Cells[_row, 10].Value = ConvertTDNumber(line.TDNumber);
            Worksheet.Cells[_row, 11].Value = line.Quantity;
            Worksheet.Cells[_row, 11].Style.Numberformat.Format = "0";

            if (decimal.TryParse(line.UnitListPrice, out decimal listPrice))
            {
                Worksheet.Cells[_row, 12].Value = string.Format(PRICE_FORMAT, listPrice);
            }
            else
            {
                Worksheet.Cells[_row, 12].Value = NA;
            }

            Worksheet.Cells[_row, 13].Value = string.Format(PRICE_FORMAT, line.UnitPrice);

            if (decimal.TryParse(line.ExtendedPrice, out decimal extendedPrice))
            {
                Worksheet.Cells[_row, 14].Value = string.Format(PRICE_FORMAT, extendedPrice);
            }
            else
            {
                Worksheet.Cells[_row, 14].Value = NA;
            }
        }

        private void FillLineDataAttributes(Line line)
        {

            var startDate = line.Attributes?.FirstOrDefault(s => s.Name.Equals("REQUESTEDSTARTDATE"))?.Value;
            Worksheet.Cells[_row, 6].Value = startDate ?? "";

            var autoRenew = line.Attributes?.FirstOrDefault(s => s.Name.Equals("AUTORENEWALTERM"))?.Value;
            Worksheet.Cells[_row, 7].Value = autoRenew ?? "";

            var deal = line.Attributes?.FirstOrDefault(s => s.Name.Equals("DEALDURATION"))?.Value;
            Worksheet.Cells[_row, 8].Value = deal ?? "";

            var billing = line.Attributes?.FirstOrDefault(s => s.Name.Equals("BILLINGTERM"))?.Value;
            Worksheet.Cells[_row, 9].Value = billing ?? "";
        }

        private static string ConvertTDNumber(string tdNumber)
        {
            var result = NOT_AVAILABLE;

            if (!string.IsNullOrEmpty(tdNumber))
            {
                result = int.TryParse(tdNumber, out int tdNumberInt)
                    ? tdNumberInt.ToString()
                    : tdNumber;

                //if (int.TryParse(tdNumber, out int tdNumberInt))
                //    result = tdNumberInt.ToString();
                //else
                //    result = tdNumber;
            }

            return result;
        }

        private void StyleAndInsertRow(int _row)
        {
            Worksheet.Row(_row).Style.Font.Name = Settings.FontName;
            Worksheet.Row(_row).Height = 91;
            _row++;
            Worksheet.InsertRow(_row, 1, 1);
        }

        private void SetCenterAlignment()
        {
            Worksheet.Cells[_row, _col].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            Worksheet.Cells[_row, _col].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
        }

        private static void ApplyMarkup(IQuoteDetailsDocumentModel quoteDetails)
        {
            decimal totalMarkUp = 0.0M;
            if (quoteDetails.Items != null)
            {
                foreach (var item in quoteDetails.Items)
                {
                    decimal extendedPrice;
                    extendedPrice = AppluMarkUpForParentLine(quoteDetails, ref totalMarkUp, item);

                    var sublines = item.Children;

                    if (sublines.Any())
                    {
                        ApplyMarkUpForSubLines(quoteDetails, ref totalMarkUp, ref extendedPrice, sublines);
                    }

                }
            }

            quoteDetails.SubTotal = totalMarkUp + quoteDetails.SubTotal;
        }

        private static decimal AppluMarkUpForParentLine(IQuoteDetailsDocumentModel quoteDetails, ref decimal totalMarkUp, Line item)
        {
            decimal extendedPrice;
            if (quoteDetails.Request.LineMarkup.ToList().Where(x => x.Id.Equals(item.Id)).Any())
            {
                decimal markup = quoteDetails.Request.LineMarkup.ToList().Where(x => x.Id.Equals(item.Id)).FirstOrDefault().MarkupValue;

                item.UnitPrice = markup + item.UnitPrice;
                totalMarkUp += item.Quantity * markup;
            }

            if (decimal.TryParse((item.Quantity * (decimal)item.UnitPrice).ToString(), out extendedPrice))
                item.ExtendedPrice = Math.Round(extendedPrice, 2).ToString();
            return extendedPrice;
        }

        private static void ApplyMarkUpForSubLines(IQuoteDetailsDocumentModel quoteDetails, ref decimal totalMarkUp, ref decimal extendedPrice, List<Line> sublines)
        {
            foreach (var subLine in sublines)
            {
                if (quoteDetails.Request.LineMarkup.ToList().Where(x => x.Id.Equals(subLine.Id)).Any())
                {
                    var subLineMarkup = quoteDetails.Request.LineMarkup.ToList().Where(x => x.Id.Equals(subLine.Id)).FirstOrDefault().MarkupValue;

                    subLine.UnitPrice = subLineMarkup + subLine.UnitPrice;
                    totalMarkUp += subLine.Quantity * subLineMarkup;
                }
                if (decimal.TryParse((subLine.Quantity * (decimal)subLine.UnitPrice).ToString(), out extendedPrice))
                    subLine.ExtendedPrice = Math.Round(extendedPrice, 2).ToString();
            }
        }

        private void GetLineHeader()
        {
            int xlCol = 2;
            int colval = 1;
            foreach (string colHeadervalue in COLUMNS_TO_EXPORT)
            {
                Worksheet.Cells[_row, xlCol + colval].Value = colHeadervalue;
                Worksheet.Cells[_row, xlCol + colval].AutoFitColumns();
                if (xlCol + colval >= 11)
                {
                    Worksheet.Column(xlCol + colval).Width = 21;
                }
                colval++;
            }

            _row++;
        }

        private void InnerHeaderRange()
        {
            using var range = Worksheet.Cells[_row + 11, _col + 1, _row + 11, _col + 14];
            range.Style.Font.Bold = true;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Settings.DefaultBackgroundColor);
            range.Style.Border.BorderAround(Settings.DefaultBorder);
            range.Style.Font.Size = 12;
            range.Style.Font.Name = Settings.FontName;
        }

        private void BottomBlankRow()
        {
            GenerateBoldColoredBorderedRange(_row + 9, _col, _col + 14);
        }

        private void StyleQuoteSection()
        {
            Worksheet.Cells[_row + 3, _col, _row + 3, _col + 10].Style.Font.Size = Settings.CellFontSize;
            Worksheet.Cells[_row + 3, _col, _row + 3, _col + 10].Style.Font.Name = Settings.FontName;
            Worksheet.Cells[_row + 4, _col, _row + 8, _col + 10].Style.Font.Size = Settings.CellFontSize;
            Worksheet.Cells[_row + 4, _col, _row + 8, _col + 10].Style.Font.Name = Settings.FontName;

            Worksheet.Cells[_row + 4, _col + 6].Style.Font.Size = Settings.CellFontSize;
            Worksheet.Cells[_row + 4, _col + 6].Style.Font.Name = Settings.FontName;
            Worksheet.Cells[_row + 4, _col + 7].Style.Font.Size = Settings.CellFontSize;
            Worksheet.Cells[_row + 4, _col + 7].Style.Font.Name = Settings.FontName;

            using var quoteDetailBroder = Worksheet.Cells[_row + 3, _col + 10, _row + 8, _col + 10];
            quoteDetailBroder.Style.Border.Right.Style = Settings.DefaultBorder;
        }

        private void GenerateEndUserSection(IQuoteDetailsDocumentModel quoteDetails)
        {
            if (quoteDetails.EndUser == null)
                return;

            FillRowMergedCells(_row + 5, _col + 5, _col + 6, "Quote For :", false, true);
            FillRowMergedCells(_row + 6, _col + 5, _col + 6, quoteDetails.EndUser.Name ?? NOT_AVAILABLE,
                false);
            FillRowMergedCells(_row + 7, _col + 5, _col + 6, quoteDetails.EndUser.CompanyName ?? NOT_AVAILABLE,
                false);

            string endUserLines = $"{quoteDetails.EndUser.Line1} {quoteDetails.EndUser.Line2} {quoteDetails.EndUser.Line3}";
            FillRowMergedCells(_row + 8, _col + 5, _col + 6, string.IsNullOrWhiteSpace(endUserLines) ? NOT_AVAILABLE : endUserLines,
                false);

            string endUserLocation = $"{quoteDetails.EndUser.City} {quoteDetails.EndUser.State} {quoteDetails.EndUser.Zip}";
            FillRowMergedCells(_row + 9, _col + 5, _col + 6, string.IsNullOrWhiteSpace(endUserLocation) ? NOT_AVAILABLE : endUserLocation);

            FillRowMergedCells(_row + 10, _col + 5, _col + 6, quoteDetails.EndUser.Country);
            FillRowMergedCells(_row + 11, _col + 5, _col + 6, $"Email: {quoteDetails.EndUser.Email}");
            FillRowMergedCells(_row + 12, _col + 5, _col + 6, $"Phone: {quoteDetails.EndUser.PhoneNumber}");
        }

        private void GenerateResellerSection(IQuoteDetailsDocumentModel quoteDetails)
        {
            if (quoteDetails.Reseller == null)
                return;

            FillRowMergedCells(_row + 5, _col + 1, _col + 2, "From :", false, true);
            FillRowMergedCells(_row + 6, _col + 1, _col + 2, quoteDetails.Reseller.CompanyName ?? NOT_AVAILABLE,
                false);
            FillRowMergedCells(_row + 7, _col + 1, _col + 2, quoteDetails.Reseller.Name ?? NOT_AVAILABLE,
                false);

            string resellerLines = $"{quoteDetails.Reseller.Line1} {quoteDetails.Reseller.Line3} {quoteDetails.Reseller.Line3}";
            FillRowMergedCells(_row + 8, _col + 1, _col + 2, string.IsNullOrWhiteSpace(resellerLines) ? NOT_AVAILABLE : resellerLines,
                false);

            string resellerLocation = $"{quoteDetails.Reseller.City} {quoteDetails.Reseller.State} {quoteDetails.Reseller.Zip}";
            FillRowMergedCells(_row + 9, _col + 1, _col + 2, string.IsNullOrWhiteSpace(resellerLocation) ? NOT_AVAILABLE : resellerLocation);

            FillRowMergedCells(_row + 10, _col + 1, _col + 2, quoteDetails.Reseller.Country ?? NOT_AVAILABLE);
            FillRowMergedCells(_row + 11, _col + 1, _col + 2, $"Email: {quoteDetails.Reseller.Email ?? NOT_AVAILABLE}");
            FillRowMergedCells(_row + 12, _col + 1, _col + 2, $"Phone: {quoteDetails.Reseller.PhoneNumber ?? NOT_AVAILABLE}");
        }

        private void FillRowMergedCells(int row, int startCol, int endCol, string value,
            bool useDefaultFont = true, bool bold = false)
        {
            Worksheet.Cells[row, startCol, row, endCol].Merge = true;
            if (useDefaultFont)
            {
                Worksheet.Cells[row, startCol, row, endCol].Style.Font.Name = Settings.FontName;
            }
            Worksheet.Cells[row, startCol, row, endCol].Style.Font.Bold = bold;
            Worksheet.Cells[row, startCol].Value = value;
        }

        private void FillQuickQuoteDealId(IQuoteDetailsDocumentModel quoteDetails)
        {
            Worksheet.Cells[_row + 3, _col + 2].Value = quoteDetails.SPAId;
            if (QuickQuoteDealId.Length > 0
                && quoteDetails.VendorReference != null
                && quoteDetails.VendorReference.Any(s => s.Type.Equals("IsQuickQuoteCreated", StringComparison.InvariantCultureIgnoreCase)))
            {
                Worksheet.Cells[_row + 4, _col + 6].Value = "Deal Id:";
                Worksheet.Cells[_row + 4, _col + 7].Value = QuickQuoteDealId;
            }
        }

        private void GenerateNotes(IQuoteDetailsDocumentModel quoteDetails)
        {
            if (string.IsNullOrWhiteSpace(quoteDetails.Notes))
                return;
            Worksheet.Cells[_row + 3, _col + 11].Value = $"Notes: {quoteDetails.Notes}";
        }

        private void FillHPEEstimateDealId(IQuoteDetailsDocumentModel quoteDetails)
        {
            IsHPEQuote = quoteDetails.Attributes != null
                            && quoteDetails.Attributes.Any(a => a.Name.Equals("VENDOR") && a.Value.Equals("HP"));

            if (IsHPEQuote)
            {
                FillHPEQuoteId(quoteDetails);
            }
            else if (quoteDetails.VendorReference?.Count > 0
                && quoteDetails.VendorReference.Any(s => s.Type.Equals("supplierQuoteRef", StringComparison.InvariantCultureIgnoreCase)))
            {
                FillCheckpointQuoteId(quoteDetails);
            }
            else
            {
                FillEstimateDealId(quoteDetails);
            }
        }

        private void FillHPEQuoteId(IQuoteDetailsDocumentModel quoteDetails)
        {
            var hpeQuoteId = quoteDetails.VendorReference?
                                .First(s => s.Type.Equals("VENDORQUOTEID", StringComparison.InvariantCultureIgnoreCase))?
                                .Value;

            if (!string.IsNullOrWhiteSpace(hpeQuoteId))
            {
                Worksheet.Cells[_row + 3, _col + 6].Value = "HPE Quote ID: " + hpeQuoteId;
            }
        }

        private void FillEstimateDealId(IQuoteDetailsDocumentModel quoteDetails)
        {
            var label = "Estimate/Deal ID:";
            if (quoteDetails.VendorReference?.Count > 0
                && Convert.ToBoolean(quoteDetails.VendorReference.FirstOrDefault(s =>
                                  s.Type.Equals("IsQuickQuoteCreated", StringComparison.InvariantCultureIgnoreCase))?
                              .Value))
            {
                label = "Estimate Id:";
            }

            Worksheet.Cells[_row + 3, _col + 6].Value = label;
            Worksheet.Cells[_row + 3, _col + 7].Value = string.IsNullOrEmpty(OriginalEstimateId)
                ? EstimateDealId
                : OriginalEstimateId;
            Worksheet.Cells[_row + 3, _col + 7].Style.Font.Size = Settings.CellFontSize;
            Worksheet.Cells[_row + 3, _col + 7].Style.Font.Name = Settings.FontName;
        }

        private void FillCheckpointQuoteId(IQuoteDetailsDocumentModel quoteDetails)
        {
            string checkpointQuoteId = quoteDetails.VendorReference
                .Where(s => s.Type.Equals("supplierQuoteRef", StringComparison.InvariantCultureIgnoreCase))
                .FirstOrDefault()
                .Value;

            if (!string.IsNullOrWhiteSpace(checkpointQuoteId))
            {
                Worksheet.Cells[_row + 3, _col + 6].Value = "Checkpoint Quote ID:";
                Worksheet.Cells[_row + 3, _col + 7].Value = checkpointQuoteId;
                Worksheet.Cells[_row + 3, _col + 7].Style.Font.Size = Settings.CellFontSize;
                Worksheet.Cells[_row + 3, _col + 7].Style.Font.Name = Settings.FontName;
            }
        }

        private void FillQuoteAndDate(IQuoteDetailsDocumentModel quoteDetails)
        {
            Worksheet.Cells[_row + 3, _col + 1].Value = $"Quote#: {quoteDetails.Id}";
            if (DateTime.TryParse(quoteDetails.Created, out DateTime created))
            {
                Worksheet.Cells[_row + 3, _col + 5].Value = $"Date: {created.ToShortDateString()}";
            }
        }

        private void SetProperties(IQuoteDetailsDocumentModel quoteDetails)
        {
            if (quoteDetails.VendorReference != null || quoteDetails.VendorReference?.Count == 0)
                return;

            SetOriginalEstimateId(quoteDetails);
            SetQuickQuoteDealId(quoteDetails);
            SetEstimateDealId(quoteDetails);
        }

        private void SetEstimateDealId(IQuoteDetailsDocumentModel quoteDetails)
        {
            if (!string.IsNullOrEmpty(EstimateDealId)
                            && EstimateDealId.Length == 0
                            && quoteDetails.VendorReference != null
                            && quoteDetails.VendorReference.Any(s => s.Type.Equals(DEAL_IDENTIFIER, StringComparison.InvariantCultureIgnoreCase))
                            )
            {
                EstimateDealId = quoteDetails.VendorReference
                    .FirstOrDefault(s => s.Type.Equals(DEAL_IDENTIFIER, StringComparison.InvariantCultureIgnoreCase))
                    .Value;
            }
        }

        private void SetQuickQuoteDealId(IQuoteDetailsDocumentModel quoteDetails)
        {
            if (quoteDetails.Attributes == null)
                return;
            else if (quoteDetails.Attributes.Any(s => s.Name.Equals(DEAL_IDENTIFIER, StringComparison.InvariantCultureIgnoreCase)))
            {
                QuickQuoteDealId = quoteDetails.Attributes
                    .FirstOrDefault(s => s.Name.Equals(DEAL_IDENTIFIER, StringComparison.InvariantCultureIgnoreCase))
                    .Value;
            }
        }

        private void SetOriginalEstimateId(IQuoteDetailsDocumentModel quoteDetails)
        {
            if (quoteDetails.Attributes == null)
                return;
            else if (quoteDetails.Attributes.Any(s => s.Name.Equals(ORIGINAL_ESTIMATE_ID, StringComparison.InvariantCultureIgnoreCase)))
            {
                OriginalEstimateId = quoteDetails.Attributes
                    .FirstOrDefault(s => s.Name.Equals(ORIGINAL_ESTIMATE_ID, StringComparison.InvariantCultureIgnoreCase))
                    .Value;
            }
        }

        private void GenerateQuoteDetailHeader()
        {
            GenerateBoldColoredBorderedRange(_row + 2, _col, _col + 14);
        }

        private void GenerateBoldColoredBorderedRange(int row, int startCol, int endCol)
        {
            using var range = Worksheet.Cells[row, startCol, row, endCol];
            range.Merge = true;
            range.Style.Font.Bold = true;
            range.Style.Font.Size = 10;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Settings.DefaultBackgroundColor);
            range.Style.Border.BorderAround(Settings.DefaultBorder);
            range.Style.Font.Name = Settings.FontName;
        }

        private void GenerateReportHeader()
        {
            ExcelRange Rng = Worksheet.Cells[_row, _col, _row, _col + 8];
            Rng.Merge = true;
            Rng.Value = "Tech Data Quote Details"; // This should probably be coming from a constant or from data. Could this be the reseller name (whitelabel)
            Rng.Style.Font.Size = 22;
            Rng.Style.Font.Name = Settings.FontName;
            Rng.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
            Worksheet.Row(_row).Height = 66;
            Worksheet.Cells[_row, _col].Style.WrapText = false;
        }

    }
}
