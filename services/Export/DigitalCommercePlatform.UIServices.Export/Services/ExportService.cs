//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models;
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalFoundation.Common.Contexts;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using Microsoft.AspNetCore.Http;

namespace DigitalCommercePlatform.UIServices.Export.Services
{
    [ExcludeFromCodeCoverage]
    public class ExportService : IExportService
    {
        private readonly ILogger<ExportService> _logger;
        private readonly IUIContext _context;

        public ExportService(ILogger<ExportService> logger,
                             IUIContext context)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _context = context;

        }

        
        [SuppressMessage("Critical Code Smell", "S3776:Cognitive Complexity of methods should not be too high", Justification = "<Pending>")]
        public async Task<byte[]> GetQuoteDetailsAsXls(QuoteDetails quoteDetails, string logo, LineMarkup[] markupData)
        {
            string estimateDealId = string.Empty;
            bool isHPEQuote = true;

            //MemoryStream mStream = null;
            int xlRow = 2;
            int xlCol = 2;
            decimal subTotal = quoteDetails.SubTotal;
            string ancillaryChargesWithTitle = string.Empty;
            decimal totalAmount = 987654;
            string endUserPO = quoteDetails.EndUserPO;
            //string lineDescription = "Mocked Line Description";
            string originalEstimateId = "Original Est. ID";
            string checkpointQuoteId = "Mocked checkpoint Q ID";
            string quickQuoteDealId = quoteDetails.SPAId ?? string.Empty;
            var hpeQuoteId = string.Empty;
            bool isAnnuityPresent = false;
            Regex rx = new("/[A-Za-z]{2}/", RegexOptions.Compiled | RegexOptions.IgnoreCase);

            using var pkg = new ExcelPackage();
            var workBook = pkg.Workbook;
            ExcelWorksheet wsQuoteDetail = pkg.Workbook.Worksheets.Add("Quote Details");
            pkg.Workbook.Worksheets.MoveToStart("Quote Details");

            GenerateReportHeader(xlRow, xlCol, wsQuoteDetail);
            GenerateQuoteDetailHeader(xlRow, xlCol, wsQuoteDetail);

            #region Quotes Section

            PullInDataForQuickQuote(quoteDetails, ref originalEstimateId, ref quickQuoteDealId);

            if (!string.IsNullOrEmpty(estimateDealId) && estimateDealId.Length == 0 && quoteDetails.Source != null
                && quoteDetails.Source.Any(s => s.Type.Equals("DealIdentifier", StringComparison.InvariantCultureIgnoreCase)))
                estimateDealId = quoteDetails.Source
                    .Where(s => s.Type.Equals("DealIdentifier", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value;

            wsQuoteDetail.Cells[xlRow + 3, xlCol + 1].Value = $"Quote#: {quoteDetails.Id}";
            if (DateTime.TryParse(quoteDetails.Created, out DateTime created))
                wsQuoteDetail.Cells[xlRow + 3, xlCol + 5].Value = $"Date: {created.ToShortDateString()}";

            if (isHPEQuote)
            {
                hpeQuoteId = quoteDetails.Source?
                    .Where(s => s.Type.Equals("VENDORQUOTEID", StringComparison.InvariantCultureIgnoreCase))
                    .FirstOrDefault()?.Value;

                if (!string.IsNullOrWhiteSpace(hpeQuoteId))
                {
                    wsQuoteDetail.Cells[xlRow + 3, xlCol + 6].Value = "HPE Quote ID: " + hpeQuoteId;
                }
            }
            else if (quoteDetails.Source?.Count > 0 && quoteDetails.Source.Any(s => s.Type.Equals("supplierQuoteRef", StringComparison.InvariantCultureIgnoreCase)))
            {
                checkpointQuoteId = FillCheckpointQuoteId(quoteDetails, xlRow, xlCol, wsQuoteDetail);
            }
            else
            {

                if (quoteDetails.Source?.Count > 0 && rx.Match(originalEstimateId).Length > 0 && Convert.ToBoolean(quoteDetails.Source.Where(s => s.Type.Equals("IsQuickQuoteCreated", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value))
                    wsQuoteDetail.Cells[xlRow + 3, xlCol + 6].Value = "Estimate Id:";
                else
                    wsQuoteDetail.Cells[xlRow + 3, xlCol + 6].Value = "Estimate/Deal ID:";
                wsQuoteDetail.Cells[xlRow + 3, xlCol + 7].Value = !string.IsNullOrEmpty(originalEstimateId) ? originalEstimateId : estimateDealId;
                wsQuoteDetail.Cells[xlRow + 3, xlCol + 7].Style.Font.Size = 11;
                wsQuoteDetail.Cells[xlRow + 3, xlCol + 7].Style.Font.Name = Constants.DefaultXlsFontName;
            }
            wsQuoteDetail.Cells[xlRow + 3, xlCol + 11].Value = $"Notes: {quoteDetails.Notes}";
            wsQuoteDetail.Cells[xlRow + 3, xlCol + 2].Value = quoteDetails.SPAId;
            if (quickQuoteDealId.Length > 0 && rx.Match(originalEstimateId).Length == 0
                && quoteDetails.Source != null
                && quoteDetails.Source.Any(s => s.Type.Equals("IsQuickQuoteCreated", StringComparison.InvariantCultureIgnoreCase)))
            {
                wsQuoteDetail.Cells[xlRow + 4, xlCol + 6].Value = "Deal Id:";
                wsQuoteDetail.Cells[xlRow + 4, xlCol + 7].Value = quickQuoteDealId;
            }

            if (quoteDetails.Reseller != null)
            {
                SectionFromReseller(quoteDetails, xlRow, xlCol, wsQuoteDetail);
            }
            if (quoteDetails.EndUser != null)
            {
                SectionQuoteForEndUser(quoteDetails, xlRow, xlCol, wsQuoteDetail);
            }

            SectionQuoteStyling(xlRow, xlCol, wsQuoteDetail);

            using var quoteDetailBroder = wsQuoteDetail.Cells[xlRow + 3, xlCol + 10, xlRow + 8, xlCol + 10];
            quoteDetailBroder.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            xlRow += 5;

            BottomBlankRow(xlRow, xlCol, wsQuoteDetail);

            using var headerRangeBorder = wsQuoteDetail.Cells[xlRow + 8, xlCol, xlRow + 8, xlCol + 14];
            headerRangeBorder.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

            #endregion
            #region Line/SubLine
            InnerHeaderRange(xlRow, xlCol, wsQuoteDetail);
            using (var innerHeaderBorder = wsQuoteDetail.Cells[xlRow + 10, xlCol + 1, xlRow + 10, xlCol + 14])
            {
                innerHeaderBorder.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            }
            xlRow += 11;
            string[] colstoExport = new string[] { };
            // populate the Header for Line / Subline Details
            getLineHeader(ref wsQuoteDetail, ref xlRow, ref colstoExport);
            applyMarkup(quoteDetails, markupData);
            //Load data for Line/SubLine
            if (quoteDetails.Items?.Count > 0)
            {
                ancillaryChargesWithTitle = quoteDetails.Items.First().AncillaryChargesWithTitles == null
                    ? string.Empty
                    : quoteDetails.Items.First().AncillaryChargesWithTitles;
                //totalAmount = quoteLines.First().Total;

                foreach (Line line in quoteDetails.Items.OrderBy(i => i.Id))
                {
                    MapLineLevelData(ref wsQuoteDetail, line, xlRow, estimateDealId, line.Annuity);
                    xlRow += 1;
                    if (!line.IsSubLine && line.Annuity != null && !isAnnuityPresent && !string.IsNullOrEmpty(line.DisplayLineNumber))
                        isAnnuityPresent = true;
                }
            }

            wsQuoteDetail.Row(xlRow).Height = 35;
            #endregion

            #region Total
            //Total Heading
            using (var totalHeading = wsQuoteDetail.Cells[xlRow + 1, xlCol + 10, xlRow + 1, xlCol + 13])
            {
                totalHeading.Merge = true;
                totalHeading.Value = "Total";
                totalHeading.Style.Font.Name = Constants.DefaultXlsFontName;
                totalHeading.Style.Font.Size = 10;
                totalHeading.Style.Font.Bold = true;
                totalHeading.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                totalHeading.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
                totalHeading.Style.Fill.PatternType = ExcelFillStyle.Solid;
                totalHeading.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(197, 217, 241));
            }
            using (var totalHeadingBorder = wsQuoteDetail.Cells[xlRow, xlCol + 10, xlRow, xlCol + 13])
            {
                totalHeadingBorder.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            }

            wsQuoteDetail.Cells[xlRow + 3, xlCol + 11].Value = "Subtotal";
            wsQuoteDetail.Cells[xlRow + 3, xlCol + 12, xlRow + 3, xlCol + 13].Merge = true;
            wsQuoteDetail.Cells[xlRow + 3, xlCol + 12, xlRow + 3, xlCol + 13].Value = subTotal > 0 ? String.Format("{0:$#,##0.00;($#,##0.00);$0.00}", Math.Round(subTotal, 2)) : "$0.00";

            //Ancillary charges
            var ancillaryLines = 0;
            foreach (var anciCharge in SplitString(ancillaryChargesWithTitle, ",_,"))
            {
                if (!string.IsNullOrEmpty(anciCharge) && anciCharge.Length > 0)
                {
                    var arrCharges = SplitString(anciCharge, ":^:");
                    if (arrCharges.Length >= 2)
                    {
                        decimal val = Decimal.Parse(arrCharges[1]);
                        wsQuoteDetail.Cells[xlRow + 4 + ancillaryLines, xlCol + 11].Value = arrCharges[0].Trim();
                        wsQuoteDetail.Cells[xlRow + 4 + ancillaryLines, xlCol + 12, xlRow + 4 + ancillaryLines, xlCol + 13].Merge = true;
                        wsQuoteDetail.Cells[xlRow + 4 + ancillaryLines, xlCol + 12, xlRow + 4 + ancillaryLines, xlCol + 13].Value = val > 0 ? String.Format("{0:$#,##0.00;($#,##0.00);$0.00}", Math.Round(val, 2)) : "$0.00";
                        ancillaryLines++;
                    }
                }
            }

            var shippingAndHandlingRow = xlRow + 4 + ancillaryLines;
            var quoteTotalRow = shippingAndHandlingRow;
            if (isHPEQuote)
            {
                wsQuoteDetail.Cells[shippingAndHandlingRow, xlCol + 11].Value = "Shipping and Handling";
                wsQuoteDetail.Cells[shippingAndHandlingRow, xlCol + 12, shippingAndHandlingRow, xlCol + 13].Merge = true;
                wsQuoteDetail.Cells[shippingAndHandlingRow, xlCol + 12, shippingAndHandlingRow, xlCol + 13].Value = "CALL";
                quoteTotalRow++;
            }

            wsQuoteDetail.Cells[quoteTotalRow, xlCol + 11].Value = "Quote Total";
            wsQuoteDetail.Cells[quoteTotalRow, xlCol + 12, quoteTotalRow, xlCol + 13].Merge = true;
            wsQuoteDetail.Cells[quoteTotalRow, xlCol + 12, quoteTotalRow, xlCol + 13].Value =
                totalAmount > 0 ? string.Format("{0:$#,##0.00;($#,##0.00);$0.00}", Math.Round(totalAmount, 2)) : "$0.00";

            // total section style
            using (var totalContent = wsQuoteDetail.Cells[xlRow + 3, xlCol + 10, xlRow + 9 + ancillaryLines, xlCol + 13])
            {
                totalContent.Style.Font.Name = Constants.DefaultXlsFontName;
                totalContent.Style.Font.Size = 11;
                totalContent.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                totalContent.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
            }

            using (var totalRange = wsQuoteDetail.Cells[xlRow + 1, xlCol + 10, xlRow + 6 + ancillaryLines, xlCol + 13])
            {
                totalRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            }
            #endregion
            #region TERMS & CONDITION
            xlRow += 7 + ancillaryLines;
            using (var conditionHeading = wsQuoteDetail.Cells[xlRow + 1, xlCol + 1, xlRow + 1, xlCol + 13])
            {
                conditionHeading.Merge = true;
                conditionHeading.Value = "Terms & Conditions";
                conditionHeading.Style.Font.Name = Constants.DefaultXlsFontName;
                conditionHeading.Style.Font.Size = 11;
                conditionHeading.Style.Font.Bold = true;
                conditionHeading.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                conditionHeading.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                conditionHeading.Style.Fill.PatternType = ExcelFillStyle.Solid;
                conditionHeading.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(197, 217, 241));
                conditionHeading.Worksheet.Row(xlRow + 1).Height = 22.5;

            }
            for (int i = 2; i <= 5; i++)
            {
                var termsConditionLines = SetTermsConditionProperties(wsQuoteDetail.Cells[xlRow + i, xlCol + 1, xlRow + i, xlCol + 13]);
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
                        termsConditionLines.Worksheet.Row(xlRow + i).Height = 54;
                        break;
                    case 5:
                        termsConditionLines.Value = "Tech Data is not responsible for compliance with regulations, requirements or obligations associated with any contract resulting from this quotation unless said regulations," +
                                                " requirements or obligations have been passed to Tech Data and approved in writing by an authorized representative of Tech Data.";
                        termsConditionLines.Worksheet.Row(xlRow + i).Height = 30;
                        break;
                }
            }

            int annuityDisclaimerLines = 0;
            if (isAnnuityPresent)
            {
                annuityDisclaimerLines = 4;
                for (int i = 6; i <= 9; i++)
                {
                    var termsConditionLines = SetTermsConditionProperties(wsQuoteDetail.Cells[xlRow + i, xlCol + 1, xlRow + i, xlCol + 13]);
                    switch (i)
                    {
                        case 6:
                            termsConditionLines.Value = "(1)   As per Cisco policy, billing begins either when provisioning is complete, or on the 30th day after the Requested Start Date." +
                                            " The associated cost for the initial month will be adjusted to the appropriate prorated charge based on invoice date. Separate subscription usage and modifications will be subject to the terms and pricing of the specific offers.";
                            termsConditionLines.Worksheet.Row(xlRow + 6).Height = 30;
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
                            termsConditionLines.Worksheet.Row(xlRow + 9).Height = 30;
                            break;
                    }
                }
            }

            using (var conditionRange = wsQuoteDetail.Cells[xlRow + 1, xlCol + 1, xlRow + 5 + annuityDisclaimerLines, xlCol + 13])
            {
                conditionRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            }
            #endregion
            //    //Add Border throught the content
            //    //Old Code - Ancillary Charges
            //int endRow = xlRow + 6 + annuityDisclaimerLines;
            int endRow = xlRow + 6 + ancillaryLines + annuityDisclaimerLines;
            xlRow = 2;
            using var outerBorder = wsQuoteDetail.Cells[xlRow + 1, xlCol, endRow, xlCol + 14];
            outerBorder.Style.Border.BorderAround(ExcelBorderStyle.Thick);
            wsQuoteDetail.Cells[xlRow + 1, xlCol, xlRow + 1, xlCol + 14].Style.Border.Top.Style = ExcelBorderStyle.None;

            xlCol = 2;
            SetHeaderImage(xlRow, xlCol, wsQuoteDetail, logo);

            return await Task.FromResult(pkg.GetAsByteArray());

            #region old export code
            //string estimateDealId = string.Empty;
            //bool isHPEQuote = true;

            ////MemoryStream mStream = null;
            //int xlRow = 2;
            //int xlCol = 2;
            //decimal subTotal = quoteDetails.SubTotal;
            //string ancillaryChargesWithTitle = string.Empty;
            //decimal totalAmount = 987654;
            ////string lineDescription = "Mocked Line Description";
            //string originalEstimateId = "Original Est. ID";
            //string checkpointQuoteId = "Mocked checkpoint Q ID";
            //string quickQuoteDealId = quoteDetails.SPAId ?? string.Empty;
            //var hpeQuoteId = string.Empty;
            //bool isAnnuityPresent = false;
            //Regex rx = new("/[A-Za-z]{2}/", RegexOptions.Compiled | RegexOptions.IgnoreCase);

            //using var p = new ExcelPackage();
            //ExcelWorksheet wsQuoteDetail = p.Workbook.Worksheets.Add("Quote Details");
            //p.Workbook.Worksheets.MoveToStart("Quote Details");

            //GenerateReportHeader(xlRow, xlCol, wsQuoteDetail);
            //GenerateQuoteDetailHeader(xlRow, xlCol, wsQuoteDetail);

            //#region Quotes Section

            //PullInDataForQuickQuote(quoteDetails, ref originalEstimateId, ref quickQuoteDealId);

            //if (!string.IsNullOrEmpty(estimateDealId) && estimateDealId.Length == 0 && quoteDetails.Source != null
            //    && quoteDetails.Source.Any(s => s.Type.Equals("DealIdentifier", StringComparison.InvariantCultureIgnoreCase)))
            //    estimateDealId = quoteDetails.Source
            //        .Where(s => s.Type.Equals("DealIdentifier", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value;

            //wsQuoteDetail.Cells[xlRow + 3, xlCol + 1].Value = $"Quote#: {quoteDetails.Id}";
            //if (DateTime.TryParse(quoteDetails.Created, out DateTime created))
            //    wsQuoteDetail.Cells[xlRow + 3, xlCol + 5].Value = $"Date: {created.ToShortDateString()}";

            //if (isHPEQuote)
            //{
            //    hpeQuoteId = quoteDetails.Source?
            //        .Where(s => s.Type.Equals("VENDORQUOTEID", StringComparison.InvariantCultureIgnoreCase))
            //        .FirstOrDefault()?.Value;

            //    if (!string.IsNullOrWhiteSpace(hpeQuoteId))
            //    {
            //        wsQuoteDetail.Cells[xlRow + 3, xlCol + 6].Value = "HPE Quote ID: " + hpeQuoteId;
            //    }
            //}
            //else if (quoteDetails.Source?.Count > 0 && quoteDetails.Source.Any(s => s.Type.Equals("supplierQuoteRef", StringComparison.InvariantCultureIgnoreCase)))
            //{
            //    checkpointQuoteId = FillCheckpointQuoteId(quoteDetails, xlRow, xlCol, wsQuoteDetail);
            //}
            //else
            //{

            //    if (quoteDetails.Source?.Count > 0 && rx.Match(originalEstimateId).Length > 0 && Convert.ToBoolean(quoteDetails.Source.Where(s => s.Type.Equals("IsQuickQuoteCreated", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value))
            //        wsQuoteDetail.Cells[xlRow + 3, xlCol + 6].Value = "Estimate Id:";
            //    else
            //        wsQuoteDetail.Cells[xlRow + 3, xlCol + 6].Value = "Estimate/Deal ID:";
            //    wsQuoteDetail.Cells[xlRow + 3, xlCol + 7].Value = !string.IsNullOrEmpty(originalEstimateId) ? originalEstimateId : estimateDealId;
            //    wsQuoteDetail.Cells[xlRow + 3, xlCol + 7].Style.Font.Size = 11;
            //    wsQuoteDetail.Cells[xlRow + 3, xlCol + 7].Style.Font.Name = Constants.DefaultXlsFontName;
            //}
            //wsQuoteDetail.Cells[xlRow + 3, xlCol + 11].Value = $"Notes: {quoteDetails.Notes}";
            //wsQuoteDetail.Cells[xlRow + 3, xlCol + 2].Value = quoteDetails.SPAId;
            //if (quickQuoteDealId.Length > 0 && rx.Match(originalEstimateId).Length == 0
            //    && quoteDetails.Source != null
            //    && quoteDetails.Source.Any(s => s.Type.Equals("IsQuickQuoteCreated", StringComparison.InvariantCultureIgnoreCase)))
            //{
            //    wsQuoteDetail.Cells[xlRow + 4, xlCol + 6].Value = "Deal Id:";
            //    wsQuoteDetail.Cells[xlRow + 4, xlCol + 7].Value = quickQuoteDealId;
            //}

            //if (quoteDetails.Reseller != null)
            //{
            //    SectionFromReseller(quoteDetails, xlRow, xlCol, wsQuoteDetail);
            //}
            //if (quoteDetails.EndUser != null)
            //{
            //    SectionQuoteForEndUser(quoteDetails, xlRow, xlCol, wsQuoteDetail);
            //}

            //SectionQuoteStyling(xlRow, xlCol, wsQuoteDetail);

            //using var quoteDetailBroder = wsQuoteDetail.Cells[xlRow + 3, xlCol + 10, xlRow + 8, xlCol + 10];
            //quoteDetailBroder.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            //xlRow += 5;

            //BottomBlankRow(xlRow, xlCol, wsQuoteDetail);

            //using var headerRangeBorder = wsQuoteDetail.Cells[xlRow + 8, xlCol, xlRow + 8, xlCol + 14];
            //headerRangeBorder.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

            //#endregion
            //#region Line/SubLine
            //InnerHeaderRange(xlRow, xlCol, wsQuoteDetail);
            //using (var innerHeaderBorder = wsQuoteDetail.Cells[xlRow + 10, xlCol + 1, xlRow + 10, xlCol + 14])
            //{
            //    innerHeaderBorder.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            //}
            //xlRow += 11;
            //string[] colstoExport = new string[] { };
            //// populate the Header for Line / Subline Details
            //getLineHeader(ref wsQuoteDetail, ref xlRow, ref colstoExport);

            ////Load data for Line/SubLine
            //if (quoteDetails.Items?.Count > 0)
            //{
            //    ancillaryChargesWithTitle = quoteDetails.Items.First().AncillaryChargesWithTitles == null 
            //        ? string.Empty 
            //        : quoteDetails.Items.First().AncillaryChargesWithTitles;
            //    //totalAmount = quoteLines.First().Total;

            //    foreach (Line line in quoteDetails.Items.OrderBy(i => i.Id))
            //    {
            //        MapLineLevelData(ref wsQuoteDetail, line, xlRow, estimateDealId, line.Annuity);
            //        xlRow += 1;
            //        if (!line.IsSubLine && line.Annuity != null && !isAnnuityPresent && !string.IsNullOrEmpty(line.DisplayLineNumber))
            //            isAnnuityPresent = true;
            //    }
            //}

            //wsQuoteDetail.Row(xlRow).Height = 35;
            //#endregion

            //#region Total
            ////Total Heading
            //using (var totalHeading = wsQuoteDetail.Cells[xlRow + 1, xlCol + 10, xlRow + 1, xlCol + 13])
            //{
            //    totalHeading.Merge = true;
            //    totalHeading.Value = "Total";
            //    totalHeading.Style.Font.Name = Constants.DefaultXlsFontName;
            //    totalHeading.Style.Font.Size = 10;
            //    totalHeading.Style.Font.Bold = true;
            //    totalHeading.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            //    totalHeading.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
            //    totalHeading.Style.Fill.PatternType = ExcelFillStyle.Solid;
            //    totalHeading.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(197, 217, 241));
            //}
            //using (var totalHeadingBorder = wsQuoteDetail.Cells[xlRow, xlCol + 10, xlRow, xlCol + 13])
            //{
            //    totalHeadingBorder.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            //}

            //wsQuoteDetail.Cells[xlRow + 3, xlCol + 11].Value = "Subtotal";
            //wsQuoteDetail.Cells[xlRow + 3, xlCol + 12, xlRow + 3, xlCol + 13].Merge = true;
            //wsQuoteDetail.Cells[xlRow + 3, xlCol + 12, xlRow + 3, xlCol + 13].Value = subTotal > 0 ? String.Format("{0:$#,##0.00;($#,##0.00);$0.00}", Math.Round(subTotal, 2)) : "$0.00";

            ////Ancillary charges
            //var ancillaryLines = 0;
            //foreach (var anciCharge in SplitString(ancillaryChargesWithTitle, ",_,"))
            //{
            //    if (!string.IsNullOrEmpty(anciCharge) && anciCharge.Length > 0)
            //    {
            //        var arrCharges = SplitString(anciCharge, ":^:");
            //        if (arrCharges.Length >= 2)
            //        {
            //            decimal val = Decimal.Parse(arrCharges[1]);
            //            wsQuoteDetail.Cells[xlRow + 4 + ancillaryLines, xlCol + 11].Value = arrCharges[0].Trim();
            //            wsQuoteDetail.Cells[xlRow + 4 + ancillaryLines, xlCol + 12, xlRow + 4 + ancillaryLines, xlCol + 13].Merge = true;
            //            wsQuoteDetail.Cells[xlRow + 4 + ancillaryLines, xlCol + 12, xlRow + 4 + ancillaryLines, xlCol + 13].Value = val > 0 ? String.Format("{0:$#,##0.00;($#,##0.00);$0.00}", Math.Round(val, 2)) : "$0.00";
            //            ancillaryLines++;
            //        }
            //    }
            //}

            //var shippingAndHandlingRow = xlRow + 4 + ancillaryLines;
            //var quoteTotalRow = shippingAndHandlingRow;
            //if (isHPEQuote)
            //{
            //    wsQuoteDetail.Cells[shippingAndHandlingRow, xlCol + 11].Value = "Shipping and Handling";
            //    wsQuoteDetail.Cells[shippingAndHandlingRow, xlCol + 12, shippingAndHandlingRow, xlCol + 13].Merge = true;
            //    wsQuoteDetail.Cells[shippingAndHandlingRow, xlCol + 12, shippingAndHandlingRow, xlCol + 13].Value = "CALL";
            //    quoteTotalRow++;
            //}

            //wsQuoteDetail.Cells[quoteTotalRow, xlCol + 11].Value = "Quote Total";
            //wsQuoteDetail.Cells[quoteTotalRow, xlCol + 12, quoteTotalRow, xlCol + 13].Merge = true;
            //wsQuoteDetail.Cells[quoteTotalRow, xlCol + 12, quoteTotalRow, xlCol + 13].Value =
            //    totalAmount > 0 ? string.Format("{0:$#,##0.00;($#,##0.00);$0.00}", Math.Round(totalAmount, 2)) : "$0.00";

            //// total section style
            //using (var totalContent = wsQuoteDetail.Cells[xlRow + 3, xlCol + 10, xlRow + 9 + ancillaryLines, xlCol + 13])
            //{
            //    totalContent.Style.Font.Name = Constants.DefaultXlsFontName;
            //    totalContent.Style.Font.Size = 11;
            //    totalContent.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            //    totalContent.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
            //}

            //using (var totalRange = wsQuoteDetail.Cells[xlRow + 1, xlCol + 10, xlRow + 6 + ancillaryLines, xlCol + 13])
            //{
            //    totalRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            //}
            //#endregion
            //#region TERMS & CONDITION
            //xlRow += 7 + ancillaryLines;
            //using (var conditionHeading = wsQuoteDetail.Cells[xlRow + 1, xlCol + 1, xlRow + 1, xlCol + 13])
            //{
            //    conditionHeading.Merge = true;
            //    conditionHeading.Value = "Terms & Conditions";
            //    conditionHeading.Style.Font.Name = Constants.DefaultXlsFontName;
            //    conditionHeading.Style.Font.Size = 11;
            //    conditionHeading.Style.Font.Bold = true;
            //    conditionHeading.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            //    conditionHeading.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            //    conditionHeading.Style.Fill.PatternType = ExcelFillStyle.Solid;
            //    conditionHeading.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(197, 217, 241));
            //    conditionHeading.Worksheet.Row(xlRow + 1).Height = 22.5;

            //}
            //for (int i = 2; i <= 5; i++)
            //{
            //    var termsConditionLines = SetTermsConditionProperties(wsQuoteDetail.Cells[xlRow + i, xlCol + 1, xlRow + i, xlCol + 13]);
            //    switch (i)
            //    {
            //        case 2:
            //            termsConditionLines.Value = "All prices and descriptions are subject to change without notice.";
            //            break;
            //        case 3:
            //            termsConditionLines.Value = "This price list is a quotation only and is not an order or offer to sell.";
            //            break;
            //        case 4:
            //            termsConditionLines.Value = "No contract for sale will exist unless and until a purchase order has been issued by you and accepted by Tech Data Corporation(“Tech Data”)." +
            //                                    " Acceptance by Tech Data of any offer is expressly conditioned upon your assent to the Terms and Conditions of Sale set forth in Tech Data’s invoices." +
            //                                    " The prices contained in this list may not be relied upon as the price at which Tech Data will accept an offer to purchase products unless expressly agreed to by Tech Data in writing." +
            //                                    " Products quoted were selected by Tech Data based on specifications available at the time of the quotation, and are not guaranteed to meet bid specifications." +
            //                                    " Product specifications may be changed by the manufacturer without notice. It is your responsibility to verify product conformance to specifications of any subsequent contract. All products are subject to availability from the manufacturer.";
            //            termsConditionLines.Worksheet.Row(xlRow + i).Height = 54;
            //            break;
            //        case 5:
            //            termsConditionLines.Value = "Tech Data is not responsible for compliance with regulations, requirements or obligations associated with any contract resulting from this quotation unless said regulations," +
            //                                    " requirements or obligations have been passed to Tech Data and approved in writing by an authorized representative of Tech Data.";
            //            termsConditionLines.Worksheet.Row(xlRow + i).Height = 30;
            //            break;
            //    }
            //}

            //int annuityDisclaimerLines = 0;
            //if (isAnnuityPresent)
            //{
            //    annuityDisclaimerLines = 4;
            //    for (int i = 6; i <= 9; i++)
            //    {
            //        var termsConditionLines = SetTermsConditionProperties(wsQuoteDetail.Cells[xlRow + i, xlCol + 1, xlRow + i, xlCol + 13]);
            //        switch (i)
            //        {
            //            case 6:
            //                termsConditionLines.Value = "(1)   As per Cisco policy, billing begins either when provisioning is complete, or on the 30th day after the Requested Start Date." +
            //                                " The associated cost for the initial month will be adjusted to the appropriate prorated charge based on invoice date. Separate subscription usage and modifications will be subject to the terms and pricing of the specific offers.";
            //                termsConditionLines.Worksheet.Row(xlRow + 6).Height = 30;
            //                break;
            //            case 7:
            //                termsConditionLines.Value = "(2)   Cisco recurring XaaS subscriptions can contain metered/consumption based charges based on end customer’s usage." +
            //                                " These fees are in addition to the base subscription costs and are billed in arrears based on billing frequency.";
            //                break;
            //            case 8:
            //                termsConditionLines.Value = "(3)   As per Cisco policy, once provisioned, a subscription is not able to be cancelled prior to the end date of the established term.";
            //                break;
            //            case 9:
            //                termsConditionLines.Value = "(4)   The vast majority of Cisco subscriptions are set to auto-renew. If you wish to cancel or modify the subscription prior to the renewal date," +
            //                                " Cisco requires at least 30 days advance notice to do so. While Tech Data notifies partners of upcoming renewals 120, 90, and 60 days in advance," +
            //                                " it is incumbent on the partner to cancel the renewal or request that Tech Data do so a minimum of 30 days in advance, in accordance with Cisco’s policy. ";
            //                termsConditionLines.Worksheet.Row(xlRow + 9).Height = 30;
            //                break;
            //        }
            //    }
            //}

            //using (var conditionRange = wsQuoteDetail.Cells[xlRow + 1, xlCol + 1, xlRow + 5 + annuityDisclaimerLines, xlCol + 13])
            //{
            //    conditionRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            //}
            //#endregion
            ////    //Add Border throught the content
            ////    //Old Code - Ancillary Charges
            ////int endRow = xlRow + 6 + annuityDisclaimerLines;
            //int endRow = xlRow + 6 + ancillaryLines + annuityDisclaimerLines;
            //xlRow = 2;
            //using var outerBorder = wsQuoteDetail.Cells[xlRow + 1, xlCol, endRow, xlCol + 14];
            //outerBorder.Style.Border.BorderAround(ExcelBorderStyle.Thick);
            //wsQuoteDetail.Cells[xlRow + 1, xlCol, xlRow + 1, xlCol + 14].Style.Border.Top.Style = ExcelBorderStyle.None;

            //xlCol = 2;
            //// If no Logo was supplied, use the TD Synnex logo
            //if (logo == null)
            //{
            //    FileAccess.Read()
            //}

            //await SetHeaderImage(xlRow, xlCol, wsQuoteDetail, logo);

            ////p.SaveAs(new FileInfo($"c:\\workbooks\\{quoteDetails.Id}.xlsx"));
            //return await Task.FromResult(p.GetAsByteArray());
            #endregion
        }

        private void applyMarkup(QuoteDetails quoteDetails, LineMarkup[] markupData)
        {
            foreach(var line in quoteDetails.Items)
            {
                foreach(var markupItem in markupData)
                {
                    if (markupItem.Id == line.Id && line.UnitPrice > 0 && markupItem.MarkupValue != 0)
                    {
                        line.UnitPrice += markupItem.MarkupValue;
                        line.ExtendedPrice = (line.UnitPrice * line.Quantity).ToString();
                    }
                }
            }
        }

        private static void InnerHeaderRange(int xlRow, int xlCol, ExcelWorksheet wsQuoteDetail)
        {
            using var innerHeaderRange = wsQuoteDetail.Cells[xlRow + 11, xlCol + 1, xlRow + 11, xlCol + 14];
            innerHeaderRange.Style.Font.Bold = true;
            innerHeaderRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            innerHeaderRange.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
            innerHeaderRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
            innerHeaderRange.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(197, 217, 241));
            innerHeaderRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            innerHeaderRange.Style.Font.Size = 12;
            innerHeaderRange.Style.Font.Name = Constants.DefaultXlsFontName;
        }

        private static ExcelRange BottomBlankRow(int xlRow, int xlCol, ExcelWorksheet wsQuoteDetail)
        {
            var headerRange = wsQuoteDetail.Cells[xlRow + 9, xlCol, xlRow + 9, xlCol + 14];
            headerRange.Merge = true;
            headerRange.Style.Font.Bold = true;
            headerRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            headerRange.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
            headerRange.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(197, 217, 241));
            headerRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            headerRange.Style.Font.Size = 10;
            headerRange.Style.Font.Name = Constants.DefaultXlsFontName;
            return headerRange;
        }

        private static void SectionQuoteStyling(int xlRow, int xlCol, ExcelWorksheet wsQuoteDetail)
        {
            wsQuoteDetail.Cells[xlRow + 3, xlCol, xlRow + 3, xlCol + 10].Style.Font.Size = 11;
            wsQuoteDetail.Cells[xlRow + 3, xlCol, xlRow + 3, xlCol + 10].Style.Font.Name = Constants.DefaultXlsFontName;
            wsQuoteDetail.Cells[xlRow + 4, xlCol, xlRow + 8, xlCol + 10].Style.Font.Size = 11;
            wsQuoteDetail.Cells[xlRow + 4, xlCol, xlRow + 8, xlCol + 10].Style.Font.Name = Constants.DefaultXlsFontName;

            // /* set deal id and value to Lato Regular font */
            wsQuoteDetail.Cells[xlRow + 4, xlCol + 6].Style.Font.Size = 11;
            wsQuoteDetail.Cells[xlRow + 4, xlCol + 6].Style.Font.Name = Constants.DefaultXlsFontName;
            wsQuoteDetail.Cells[xlRow + 4, xlCol + 7].Style.Font.Size = 11;
            wsQuoteDetail.Cells[xlRow + 4, xlCol + 7].Style.Font.Name = Constants.DefaultXlsFontName;
        }

        private void SetHeaderImage(int xlRow, int xlCol, ExcelWorksheet wsQuoteDetail, string resellerLogoBase64)
        {
            using (var imgRange = wsQuoteDetail.Cells[xlRow, xlCol + 9, xlRow, xlCol + 14])
            {
                imgRange.Merge = true;
                var logo = GetResellerLogo(resellerLogoBase64);

                OfficeOpenXml.Drawing.ExcelPicture pic = wsQuoteDetail.Drawings.AddPicture("LOGO", logo);
                pic.SetSize(100);
                pic.From.Column = xlCol + 9;
                pic.From.Row = xlRow - 1;
                pic.To.Column = xlCol + 10;
                imgRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
                pic.SetPosition(xlRow - 1, 10, xlCol + 9, 60);
                imgRange.Worksheet.Row(xlRow).Height = logo.PhysicalDimension.Height + 2;// 66;
                imgRange.Style.Border.Top.Style = ExcelBorderStyle.Thick;
                imgRange.Style.Border.Right.Style = ExcelBorderStyle.Thick;
            }
        }

        private static void SectionQuoteForEndUser(QuoteDetails quoteDetails, int xlRow, int xlCol, ExcelWorksheet wsQuoteDetail)
        {
            //For End User Info
            wsQuoteDetail.Cells[xlRow + 5, xlCol + 5, xlRow + 5, xlCol + 6].Merge = true;
            wsQuoteDetail.Cells[xlRow + 5, xlCol + 5].Value = "Quote For :";
            wsQuoteDetail.Cells[xlRow + 5, xlCol + 5].Style.Font.Bold = true;
            wsQuoteDetail.Cells[xlRow + 6, xlCol + 5, xlRow + 6, xlCol + 6].Merge = true;
            wsQuoteDetail.Cells[xlRow + 6, xlCol + 5].Value = quoteDetails.EndUser.Name ?? "Not Available";
            wsQuoteDetail.Cells[xlRow + 7, xlCol + 5, xlRow + 7, xlCol + 6].Merge = true;
            wsQuoteDetail.Cells[xlRow + 7, xlCol + 5].Value = quoteDetails.EndUser.CompanyName ?? "Not Available";
            wsQuoteDetail.Cells[xlRow + 8, xlCol + 5, xlRow + 8, xlCol + 6].Merge = true;
            wsQuoteDetail.Cells[xlRow + 8, xlCol + 5].Value = $"{quoteDetails.EndUser.Line1} {quoteDetails.EndUser.Line2} {quoteDetails.EndUser.Line3}";
            if (wsQuoteDetail.Cells[xlRow + 8, xlCol + 5].Value.ToString().Trim() == string.Empty)
            {
                wsQuoteDetail.Cells[xlRow + 8, xlCol + 5].Value = "Not Available";
            }
            wsQuoteDetail.Cells[xlRow + 9, xlCol + 5, xlRow + 9, xlCol + 6].Merge = true;
            wsQuoteDetail.Cells[xlRow + 9, xlCol + 5, xlRow + 9, xlCol + 6].Style.Font.Name = Constants.DefaultXlsFontName;
            wsQuoteDetail.Cells[xlRow + 9, xlCol + 5].Value = $"{quoteDetails.EndUser.City} {quoteDetails.EndUser.State} {quoteDetails.EndUser.Zip}";
            if (wsQuoteDetail.Cells[xlRow + 9, xlCol + 5].Value.ToString().Trim() == string.Empty)
            {
                wsQuoteDetail.Cells[xlRow + 9, xlCol + 5].Value = "Not Available";
            }
            wsQuoteDetail.Cells[xlRow + 10, xlCol + 5, xlRow + 10, xlCol + 6].Merge = true;
            wsQuoteDetail.Cells[xlRow + 10, xlCol + 5, xlRow + 10, xlCol + 6].Style.Font.Name = Constants.DefaultXlsFontName;
            wsQuoteDetail.Cells[xlRow + 10, xlCol + 5].Value = $"{quoteDetails.EndUser.Country}";

            wsQuoteDetail.Cells[xlRow + 11, xlCol + 5, xlRow + 11, xlCol + 6].Merge = true;
            wsQuoteDetail.Cells[xlRow + 11, xlCol + 5, xlRow + 11, xlCol + 6].Style.Font.Name = Constants.DefaultXlsFontName;
            wsQuoteDetail.Cells[xlRow + 11, xlCol + 5].Value = $"Email: {quoteDetails.EndUser.Email}";

            wsQuoteDetail.Cells[xlRow + 12, xlCol + 5, xlRow + 12, xlCol + 6].Merge = true;
            wsQuoteDetail.Cells[xlRow + 12, xlCol + 5, xlRow + 12, xlCol + 6].Style.Font.Name = Constants.DefaultXlsFontName;
            wsQuoteDetail.Cells[xlRow + 12, xlCol + 5].Value = $"Phone: {quoteDetails.EndUser.PhoneNumber}";
        }

        private static void SectionFromReseller(QuoteDetails qd, int xlRow, int xlCol, ExcelWorksheet wsQuoteDetail)
        {
            wsQuoteDetail.Cells[xlRow + 5, xlCol + 1, xlRow + 5, xlCol + 2].Merge = true;
            wsQuoteDetail.Cells[xlRow + 5, xlCol + 1].Value = "From :";
            wsQuoteDetail.Cells[xlRow + 5, xlCol + 1].Style.Font.Bold = true;
            wsQuoteDetail.Cells[xlRow + 6, xlCol + 1, xlRow + 6, xlCol + 2].Merge = true;
            wsQuoteDetail.Cells[xlRow + 6, xlCol + 1].Value = qd.Reseller.CompanyName ??"Not Available";
            wsQuoteDetail.Cells[xlRow + 7, xlCol + 1, xlRow + 7, xlCol + 2].Merge = true;
            wsQuoteDetail.Cells[xlRow + 7, xlCol + 1].Value = qd.Reseller.Name ?? "Not Available"; //company contact
            wsQuoteDetail.Cells[xlRow + 8, xlCol + 1, xlRow + 8, xlCol + 2].Merge = true;
            wsQuoteDetail.Cells[xlRow + 8, xlCol + 1].Value = $"{qd.Reseller.Line1} {qd.Reseller.Line3} {qd.Reseller.Line3}";
                                                              
            if (wsQuoteDetail.Cells[xlRow + 8, xlCol + 1].Value.ToString().Trim() == string.Empty)
            {
                wsQuoteDetail.Cells[xlRow + 8, xlCol + 1].Value = "Not Available";
            }
            wsQuoteDetail.Cells[xlRow + 9, xlCol + 1, xlRow + 9, xlCol + 2].Merge = true;
            wsQuoteDetail.Cells[xlRow + 9, xlCol + 1, xlRow + 9, xlCol + 2].Style.Font.Name = Constants.DefaultXlsFontName;
            wsQuoteDetail.Cells[xlRow + 9, xlCol + 1].Value = $"{qd.Reseller.City} {qd.Reseller.State} {qd.Reseller.Zip}";
            if (wsQuoteDetail.Cells[xlRow + 9, xlCol + 1].Value.ToString().Trim() == string.Empty)
            {
                wsQuoteDetail.Cells[xlRow + 9, xlCol + 1].Value = "Not Available";
            }
            wsQuoteDetail.Cells[xlRow + 10, xlCol + 1, xlRow + 10, xlCol + 2].Merge = true;
            wsQuoteDetail.Cells[xlRow + 10, xlCol + 1, xlRow + 10, xlCol + 2].Style.Font.Name = Constants.DefaultXlsFontName;
            wsQuoteDetail.Cells[xlRow + 10, xlCol + 1].Value = qd.Reseller.Country ?? "Not Available";

            wsQuoteDetail.Cells[xlRow + 11, xlCol + 1, xlRow + 11, xlCol + 2].Merge = true;
            wsQuoteDetail.Cells[xlRow + 11, xlCol + 1, xlRow + 11, xlCol + 2].Style.Font.Name = Constants.DefaultXlsFontName;
            wsQuoteDetail.Cells[xlRow + 11, xlCol + 1].Value = $"Email: {qd.Reseller.Email ?? "Not Available"}";

            wsQuoteDetail.Cells[xlRow + 12, xlCol + 1, xlRow + 12, xlCol + 2].Merge = true;
            wsQuoteDetail.Cells[xlRow + 12, xlCol + 1, xlRow + 12, xlCol + 2].Style.Font.Name = Constants.DefaultXlsFontName;
            wsQuoteDetail.Cells[xlRow + 12, xlCol + 1].Value = $"Phone: {qd.Reseller.PhoneNumber ?? "Not Available"}";
        }

        private static string FillCheckpointQuoteId(QuoteDetails quoteDetails, int xlRow, int xlCol, ExcelWorksheet wsQuoteDetail)
        {
            string checkpointQuoteId = quoteDetails.Source.Where(s => s.Type.Equals("supplierQuoteRef", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value;
            if (!string.IsNullOrWhiteSpace(checkpointQuoteId))
            {
                wsQuoteDetail.Cells[xlRow + 3, xlCol + 6].Value = "Checkpoint Quote ID:";
                wsQuoteDetail.Cells[xlRow + 3, xlCol + 7].Value = checkpointQuoteId;
                wsQuoteDetail.Cells[xlRow + 3, xlCol + 7].Style.Font.Size = 11;
                wsQuoteDetail.Cells[xlRow + 3, xlCol + 7].Style.Font.Name = Constants.DefaultXlsFontName;
            }

            return checkpointQuoteId;
        }

        private static void PullInDataForQuickQuote(QuoteDetails quoteDetails, ref string originalEstimateId, ref string quickQuoteDealId)
        {
            if (quoteDetails.Source == null || quoteDetails.Source.Count == 0)
                return;

            if (quoteDetails.Source.Any(s => s.Type.Equals("OriginalEstimateId", StringComparison.InvariantCultureIgnoreCase)))
                originalEstimateId = quoteDetails.Source.Where(s => s.Type.Equals("OriginalEstimateId", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value;
            
            if (quoteDetails.Source.Any(s => s.Type.Equals("DealIdentifier", StringComparison.InvariantCultureIgnoreCase)))
                quickQuoteDealId = quoteDetails.Source.Where(s => s.Type.Equals("DealIdentifier", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value;
            
        }

        private static void GenerateQuoteDetailHeader(int xlRow, int xlCol, ExcelWorksheet wsQuoteDetail)
        {
            var headerRange = wsQuoteDetail.Cells[xlRow + 2, xlCol, xlRow + 2, xlCol + 14];
            headerRange.Merge = true;
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.Size = 10;
            headerRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            headerRange.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
            headerRange.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(197, 217, 241));
            headerRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);

            var headerRangeBorder = wsQuoteDetail.Cells[xlRow + 1, xlCol, xlRow + 1, xlCol + 14];
            headerRangeBorder.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        }

        private static void GenerateReportHeader(int xlRow, int xlCol, ExcelWorksheet wsQuoteDetail)
        {
            ExcelRange Rng = wsQuoteDetail.Cells[xlRow, xlCol, xlRow, xlCol + 8];
            Rng.Merge = true;
            Rng.Value = "Tech Data Quote Details"; // This should probably be coming from a constant or from data. Could this be the reseller name (whitelabel)
            Rng.Style.Font.Size = 22;
            Rng.Style.Font.Name = Constants.DefaultXlsFontName;
            Rng.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
            wsQuoteDetail.Row(xlRow).Height = 66;
            wsQuoteDetail.Cells[xlRow, xlCol].Style.WrapText = false;
        }

        private static Image GetResellerLogo(string logo)
        {
            //using MemoryStream memoryStream = new();
            if (!string.IsNullOrEmpty(logo))
            {
                byte[] bytes = Convert.FromBase64String(logo);

                using (var ms = new MemoryStream(bytes))
                {
                    return Image.FromStream(ms);
                }
                //await logo.CopyToAsync(memoryStream);
                //return Image.FromStream(memoryStream);
            }
            else
            {
                return GetTdLogo();
            }
        }

        private static Image GetTdLogo()
        {
            var filename = "td-synnex-logo.png";
            string fileloc = "Content";
            string path = Path.Combine(Directory.GetCurrentDirectory(), fileloc, filename);
            return Image.FromFile(path);
        }

        private ExcelRange SetTermsConditionProperties(ExcelRange termsConditionLines)
        {
            termsConditionLines.Merge = true;
            termsConditionLines.Style.Font.Name = Constants.DefaultXlsFontName;
            termsConditionLines.Style.Font.Size = 10;
            termsConditionLines.Style.WrapText = true;
            return termsConditionLines;
        }

        private string[] SplitString(string data, string seperator)
        {
            string[] values = data.Split(new string[] { seperator }, StringSplitOptions.None);
            return values;
        }

        private void getLineHeader(ref ExcelWorksheet wsQuoteDetail, ref int xlRow, ref string[] colsToExport)
        {
            int xlCol = 2;
            if (colsToExport.Length <= 0)
            {
                colsToExport = new string[] { "LINE", "Product Description", "VENDOR PART #", "Start Date", "Auto Renew", "Duration", "Billing", "TECH DATA PART #", "QTY", "LIST PRICE", "ITEM PRICE", "EXTENDED PRICE", " ", " ", " ", " ", " ", " " };
            }
            int colval = 1;
            foreach (string colHeadervalue in colsToExport)
            {
                wsQuoteDetail.Cells[xlRow, xlCol + colval].Value = colHeadervalue;
                wsQuoteDetail.Cells[xlRow, xlCol + colval].AutoFitColumns();
                if (xlCol + colval >= 11)
                {
                    wsQuoteDetail.Column(xlCol + colval).Width = 21;
                }
                colval++;
            }

            xlRow++;
        }

        private static void MapLineLevelData(ref ExcelWorksheet sheet, Line line, int xlRow, string estimateDealId, Annuity annuity)
        {
            for (int column = 3; column < 15; column++)
            {
                SetCenterAlignment(sheet, xlRow, column);
            }

            if (!line.IsSubLine && !string.IsNullOrEmpty(line.DisplayLineNumber))
            {
                FillLineNumberData(sheet, line, xlRow, annuity);
            }
            else if (!string.IsNullOrEmpty(estimateDealId) && line.IsSubLine && !string.IsNullOrEmpty(line.DisplayLineNumber))
            {
                FillSubLineData(sheet, line, xlRow);
            }

            StyleAndInsertRow(sheet, xlRow);
        }

        private static void FillSubLineData(ExcelWorksheet sheet, Line line, int xlRow)
        {
            string[] splitLineNumber = line.DisplayLineNumber.Split('.');
            if (splitLineNumber[splitLineNumber.Length - 1] == "1")
            {
                sheet.Cells[xlRow - 1, 3].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            }
            sheet.Cells[xlRow, 3].Value = line.DisplayLineNumber;
            sheet.Cells[xlRow, 3].Style.Numberformat.Format = "0.0";
            sheet.Cells[xlRow, 3].Style.Border.Left.Style = ExcelBorderStyle.Thin;

            sheet.Cells[xlRow, 4].Value = !string.IsNullOrEmpty(line.Description) ? line.Description : "Not available";
            sheet.Cells[xlRow, 5].Value = !string.IsNullOrEmpty(line.VendorPartNo) ? line.VendorPartNo: "Not available";
            sheet.Cells[xlRow, 6].Value = "n/a";
            sheet.Cells[xlRow, 7].Value = "n/a";
            sheet.Cells[xlRow, 8].Value = "n/a";
            sheet.Cells[xlRow, 9].Value = "n/a";

            sheet.Cells[xlRow, 10].Value = !string.IsNullOrEmpty(line.TDNumber) ? line.TDNumber: "Not available";

            sheet.Cells[xlRow, 11].Value = line.Quantity;
            sheet.Cells[xlRow, 11].Style.Numberformat.Format = "0";

            if (decimal.TryParse(line.UnitListPrice, out decimal listPrice))
                sheet.Cells[xlRow, 12].Value = string.Format("{0:$#,##0.00;($#,##0.00);$0.00}", listPrice);
            else
                sheet.Cells[xlRow, 12].Value = "N/A";

            sheet.Cells[xlRow, 13].Value = string.Format("{0:$#,##0.00;($#,##0.00);$0.00}", line.UnitPrice);
            if (decimal.TryParse(line.ExtendedPrice, out decimal extendedPrice))
                sheet.Cells[xlRow, 14].Value = string.Format("{0:$#,##0.00;($#,##0.00);$0.00}", extendedPrice);
            else
                sheet.Cells[xlRow, 14].Value = "N/A";
        }

        private static void FillLineNumberData(ExcelWorksheet sheet, Line line, int xlRow, Annuity annuity)
        {
            sheet.Cells[xlRow, 3].Value = line.DisplayLineNumber;
            sheet.Cells[xlRow, 3].Style.Numberformat.Format = "0.0";

            sheet.Cells[xlRow, 4].Value = !string.IsNullOrEmpty(line.Description) ? line.Description : "Not available";

            sheet.Cells[xlRow, 5].Value = !string.IsNullOrEmpty(line.VendorPartNo) ? line.VendorPartNo: "Not available";

            sheet.Cells[xlRow, 6].Value = (annuity?.StartDate != null ? annuity.StartDate : "n/a");

            sheet.Cells[xlRow, 7].Value = (annuity?.AutoRenewal != null ? (annuity.AutoRenewal > 0 ? "Yes" : "No") : "n/a");

            sheet.Cells[xlRow, 8].Value = (annuity?.Duration != null ? annuity.Duration.ToString() + " months" : "n/a");

            sheet.Cells[xlRow, 9].Value = (annuity?.BillingFrequency != null ? annuity.BillingFrequency.Replace(" Billing", "") : "n/a");

            sheet.Cells[xlRow, 10].Value = !string.IsNullOrEmpty(line.TDNumber) ? line.TDNumber: "Not available";

            sheet.Cells[xlRow, 11].Value = line.Quantity;
            sheet.Cells[xlRow, 11].Style.Numberformat.Format = "0";

            if (decimal.TryParse(line.UnitListPrice, out decimal listPrice))
                sheet.Cells[xlRow, 12].Value = string.Format("{0:$#,##0.00;($#,##0.00);$0.00}", listPrice);
            else
                sheet.Cells[xlRow, 12].Value = "N/A";

            sheet.Cells[xlRow, 13].Value = string.Format("{0:$#,##0.00;($#,##0.00);$0.00}", line.UnitPrice);

            if (decimal.TryParse(line.ExtendedPrice, out decimal extendedPrice))
                sheet.Cells[xlRow, 14].Value = string.Format("{0:$#,##0.00;($#,##0.00);$0.00}", extendedPrice);
            else
                sheet.Cells[xlRow, 14].Value = "N/A";
        }

        private static int StyleAndInsertRow(ExcelWorksheet sheet, int xlRow)
        {
            sheet.Row(xlRow).Style.Font.Name = Constants.DefaultXlsFontName;
            sheet.Row(xlRow).Height = 91;
            xlRow++;
            sheet.InsertRow(xlRow, 1, 1);
            return xlRow;
        }

        private static void SetCenterAlignment(ExcelWorksheet sheet, int xlRow, int xlCol)
        {
            sheet.Cells[xlRow, xlCol].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            sheet.Cells[xlRow, xlCol].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
        }
    }
}
