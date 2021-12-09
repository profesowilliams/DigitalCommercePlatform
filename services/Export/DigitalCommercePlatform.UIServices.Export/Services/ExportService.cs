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
using DigitalCommercePlatform.UIServices.Export.Actions.Quote;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Export.Models.Order;

namespace DigitalCommercePlatform.UIServices.Export.Services
{
    public enum ExportedFields
    {
        MFRNo,
        TDNo,
        Quantity,
        UnitCost,
        Freight,
        ExtendedCost,
        Status,
        Tracking,
        Carrier,
        ShipDate,
        Invoice,
        SerialNo,
        LicenseKeys,
        VendorOrderNo,
        TDPurchaseOrderNo,
        ContractNo,
        StartDate,
        EndDate
    }

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

        public async Task<Byte[]> GetOrderDetailsAsXls(OrderDetailModel orderDetails, List<string> exportedFields)
        {
            int xlRow = 2;
            int xlCol = 2;

            using var p = new ExcelPackage();
            ExcelWorksheet wsOrderDetail = p.Workbook.Worksheets.Add("Order Details");
            p.Workbook.Worksheets.MoveToStart("Order Details");

            GenerateOrderReportHeader(xlRow, xlCol, wsOrderDetail);

            GenerateOrderDetailHeader(xlRow, xlCol, wsOrderDetail);
            GenerateOrderDetailSection(xlRow, xlCol, wsOrderDetail, orderDetails.OrderNumber, orderDetails.PODate, orderDetails.PONumber, orderDetails.EndUserPO);

            GenerateEndUserShipToDetailHeader(xlRow, xlCol, wsOrderDetail);
            GenerateEndUserShipToDetailSection(xlRow, xlCol, wsOrderDetail, orderDetails.EndUser?.First(), orderDetails.ShipTo);

            GenerateOrderDetailsHeader(xlRow, xlCol, wsOrderDetail);
            GenerateOrderDetailsSubHeader(xlRow, xlCol, wsOrderDetail, exportedFields);
            int currentRow = GenerateOrderDetailsSection(xlRow, xlCol, wsOrderDetail, orderDetails, exportedFields);

            GeneratePaymentDetailsHeader(currentRow, xlCol, wsOrderDetail);
            GeneratePaymentMethodSection(currentRow, xlCol, wsOrderDetail);
            GeneratePaymentTotalSection(currentRow, xlCol, wsOrderDetail, orderDetails.PaymentDetails);

            AdjustAllColumnWidths(wsOrderDetail);
            ExcelRange orderReport = wsOrderDetail.Cells[2, 2, currentRow + 13, 21];
            orderReport.Style.Border.BorderAround(ExcelBorderStyle.Thick);

            return await Task.FromResult(p.GetAsByteArray());
        }

        private void AdjustAllColumnWidths(ExcelWorksheet wsOrderDetail)
        {
            for (int col = 1; col <= 22; col++)
            {
                try
                {
                    wsOrderDetail.Column(col).AutoFit();
                }
                catch (Exception ex)
                {
                    string message = ex.Message;
                }
            }
        }

        [SuppressMessage("Critical Code Smell", "S3776:Cognitive Complexity of methods should not be too high", Justification = "<Pending>")]
        public async Task<byte[]> GetQuoteDetailsAsXls(QuoteDetails quoteDetails, DownloadQuoteDetails.Request request)
        {
            int xlRow = 2;
            int xlCol = 2;
            decimal subTotal = quoteDetails.SubTotal;
            decimal totalAmount = quoteDetails.SubTotal;
            string originalEstimateId = string.Empty;
            string estimateDealId = string.Empty;
            string quickQuoteDealId = quoteDetails.SPAId ?? string.Empty;
            
            bool isAnnuityPresent = false;
            Regex rx = new("/[A-Za-z]{2}/", RegexOptions.Compiled | RegexOptions.IgnoreCase);

            using var pkg = new ExcelPackage();
            ExcelWorksheet wsQuoteDetail = pkg.Workbook.Worksheets.Add("Quote Details");
            pkg.Workbook.Worksheets.MoveToStart("Quote Details");

            GenerateReportHeader(xlRow, xlCol, wsQuoteDetail);
            GenerateQuoteDetailHeader(xlRow, xlCol, wsQuoteDetail);

            #region Quotes Section

            PullInDataForQuickQuote(quoteDetails, ref originalEstimateId, ref quickQuoteDealId);

            if (!string.IsNullOrEmpty(estimateDealId)
                && estimateDealId.Length == 0
                && quoteDetails.VendorReference != null
                && quoteDetails.VendorReference.Any(s => s.Type.Equals("DealIdentifier", StringComparison.InvariantCultureIgnoreCase))
                )
            {
                estimateDealId = quoteDetails.VendorReference
                    .Where(s => s.Type.Equals("DealIdentifier", StringComparison.InvariantCultureIgnoreCase))
                    .FirstOrDefault().Value;
            }

            wsQuoteDetail.Cells[xlRow + 3, xlCol + 1].Value = $"Quote#: {quoteDetails.Id}";
            if (DateTime.TryParse(quoteDetails.Created, out DateTime created))
                wsQuoteDetail.Cells[xlRow + 3, xlCol + 5].Value = $"Date: {created.ToShortDateString()}";

            bool isHPEQuote = quoteDetails.Attributes != null 
                && quoteDetails.Attributes.Any(a => a.Name.Equals("VENDOR") && a.Value.Equals("HP"));
            var hpeQuoteId = string.Empty;
            if (isHPEQuote)
            {
                hpeQuoteId = quoteDetails.VendorReference?
                    .Where(s => s.Type.Equals("VENDORQUOTEID", StringComparison.InvariantCultureIgnoreCase))
                    .FirstOrDefault()?.Value;

                if (!string.IsNullOrWhiteSpace(hpeQuoteId))
                {
                    wsQuoteDetail.Cells[xlRow + 3, xlCol + 6].Value = "HPE Quote ID: " + hpeQuoteId;
                }
            }
            else if (quoteDetails.VendorReference?.Count > 0 && quoteDetails.VendorReference.Any(s => s.Type.Equals("supplierQuoteRef", StringComparison.InvariantCultureIgnoreCase)))
            {
                FillCheckpointQuoteId(quoteDetails, xlRow, xlCol, wsQuoteDetail);
            }
            else
            {
                if (quoteDetails.VendorReference?.Count > 0 && rx.Match(originalEstimateId).Length > 0 && Convert.ToBoolean(quoteDetails.VendorReference.Where(s => s.Type.Equals("IsQuickQuoteCreated", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value))
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
                && quoteDetails.VendorReference != null
                && quoteDetails.VendorReference.Any(s => s.Type.Equals("IsQuickQuoteCreated", StringComparison.InvariantCultureIgnoreCase)))
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
            string[] colstoExport = Array.Empty<string>();
            GetLineHeader(ref wsQuoteDetail, ref xlRow, ref colstoExport);
            ApplyMarkup(quoteDetails, request.LineMarkup);
            if (quoteDetails.Items?.Count > 0)
            {
                foreach (Line line in quoteDetails.Items.OrderBy(i => i.Id))
                {
                    MapLineLevelData(ref wsQuoteDetail, line, xlRow, estimateDealId);
                    xlRow += 1;
                }
            }

            wsQuoteDetail.Row(xlRow).Height = 35;
            #endregion

            #region Total
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
            wsQuoteDetail.Cells[xlRow + 3, xlCol + 12, xlRow + 3, xlCol + 13].Value = subTotal > 0
                ? string.Format("{0:$#,##0.00;($#,##0.00);$0.00}", Math.Round(subTotal, 2))
                : "$0.00";

            var ancillaryLines = 0;
            foreach (AncillaryItem ancillaryItem in request.AncillaryItems)
            {
                wsQuoteDetail.Cells[xlRow + 4 + ancillaryLines, xlCol + 11].Value = $"Ancillary item ({ancillaryItem.Description.Trim()})";
                wsQuoteDetail.Cells[xlRow + 4 + ancillaryLines, xlCol + 12, xlRow + 4 + ancillaryLines, xlCol + 13].Merge = true;
                wsQuoteDetail.Cells[xlRow + 4 + ancillaryLines, xlCol + 12, xlRow + 4 + ancillaryLines, xlCol + 13].Value = ancillaryItem.Value > 0
                    ? string.Format("{0:$#,##0.00;($#,##0.00);$0.00}", Math.Round(ancillaryItem.Value, 2))
                    : "$0.00";
                ancillaryLines++;
                totalAmount += ancillaryItem.Value;
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
            int endRow = xlRow + 6 + ancillaryLines + annuityDisclaimerLines;
            xlRow = 2;
            using var outerBorder = wsQuoteDetail.Cells[xlRow + 1, xlCol, endRow, xlCol + 14];
            outerBorder.Style.Border.BorderAround(ExcelBorderStyle.Thick);
            wsQuoteDetail.Cells[xlRow + 1, xlCol, xlRow + 1, xlCol + 14].Style.Border.Top.Style = ExcelBorderStyle.None;

            xlCol = 2;
            SetHeaderImage(xlRow, xlCol, wsQuoteDetail, request.Logo);

            return await Task.FromResult(pkg.GetAsByteArray());
        }

        private void ApplyMarkup(QuoteDetails quoteDetails, LineMarkup[] markupData)
        {
            foreach (var line in quoteDetails.Items)
            {
                foreach (var markupItem in markupData)
                {
                    if (markupItem.Id == line.Id && line.UnitPrice > 0 && markupItem.MarkupValue != 0)
                    {
                        line.UnitPrice += markupItem.MarkupValue;
                        line.ExtendedPrice = (line.UnitPrice * line.Quantity).ToString();
                    }
                }
            }
        }

        private void GeneratePaymentTotalSection(int currentRow, int xlCol, ExcelWorksheet wsOrderDetail, PaymentDetails paymentDetails)
        {
            ExcelRange headerRng = wsOrderDetail.Cells[currentRow + 4, xlCol + 13, currentRow + 4, xlCol + 18];
            SetOrderHeaderStyle(currentRow + 4, xlCol + 13, currentRow + 4, xlCol + 18, wsOrderDetail, "Total");
            headerRng.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

            SetCell(currentRow + 6, xlCol + 14, wsOrderDetail, "SubTotal");
            SetCell(currentRow + 6, xlCol + 15, wsOrderDetail, paymentDetails.Subtotal.Value.ToString());
            SetCell(currentRow + 7, xlCol + 14, wsOrderDetail, "Tax");
            SetCell(currentRow + 7, xlCol + 15, wsOrderDetail, paymentDetails.Tax.Value.ToString());
            SetCell(currentRow + 8, xlCol + 14, wsOrderDetail, "Freight");
            SetCell(currentRow + 8, xlCol + 15, wsOrderDetail, paymentDetails.Freight.Value.ToString());
            SetCell(currentRow + 9, xlCol + 14, wsOrderDetail, "OtherFees");
            SetCell(currentRow + 9, xlCol + 15, wsOrderDetail, paymentDetails.OtherFees.Value.ToString());
            SetCell(currentRow + 10, xlCol + 14, wsOrderDetail, "Total");
            SetCell(currentRow + 10, xlCol + 15, wsOrderDetail, paymentDetails.Total.Value.ToString());

            var rng = wsOrderDetail.Cells[currentRow + 4, xlCol + 13, currentRow + 11, xlCol + 18];
            rng.Style.Border.BorderAround(ExcelBorderStyle.Thin);
        }

        private void GeneratePaymentMethodSection(int currentRow, int xlCol, ExcelWorksheet wsOrderDetail)
        {
            ExcelRange headerRng = wsOrderDetail.Cells[currentRow + 4, xlCol + 1, currentRow + 4, xlCol + 4];
            SetOrderHeaderStyle(currentRow + 4, xlCol + 1, currentRow + 4, xlCol + 4, wsOrderDetail, "Payment Method");
            headerRng.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

            ExcelRange rng = wsOrderDetail.Cells[currentRow + 6, xlCol + 1, currentRow + 11, xlCol + 4];
            rng.Merge = true;
            rng.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            rng.Style.Font.Bold = true;
            rng.Value = "30 days net";

            rng = wsOrderDetail.Cells[currentRow + 4, xlCol + 1, currentRow + 11, xlCol + 4];
            rng.Style.Border.BorderAround(ExcelBorderStyle.Thin);
        }

        private void GeneratePaymentDetailsHeader(int currentRow, int xlCol, ExcelWorksheet wsOrderDetail)
        {
            ExcelRange headerRng = wsOrderDetail.Cells[currentRow + 2, xlCol + 1, currentRow + 2, xlCol + 4];
            SetOrderHeaderStyle(currentRow + 2, xlCol + 1, currentRow + 2, xlCol + 4, wsOrderDetail, "Payment Details");
        }

        private int GenerateOrderDetailsSection(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail, OrderDetailModel model, List<string> exportedFields)
        {
            List<Line> lines = model.Lines;
            int lineNumber = 1;
            var curXlRow = xlRow + 18 + lineNumber;
            string notAvailable = "Not available";
            foreach (var line in lines)
            {
                SetLineData(xlCol, wsOrderDetail, lineNumber, curXlRow, notAvailable, line, model, exportedFields);
                lineNumber++;
                curXlRow = xlRow + 18 + lineNumber;
            }
            return curXlRow;
        }

        private static void SetLineData(int xlCol, ExcelWorksheet wsOrderDetail, int lineNumber, int curXlRow, string notAvailable, Line line, OrderDetailModel model, List<string> exportedFields)
        {
            int curCol = xlCol;
            var firstTracking = line.Trackings.Count() > 0 ? line.Trackings.First() : new TrackingDetails() { TrackingNumber = notAvailable, Carrier = notAvailable, InvoiceNumber = notAvailable };
            SetCell(curXlRow, ++curCol, wsOrderDetail, lineNumber.ToString());
            if (exportedFields.Contains(nameof(ExportedFields.MFRNo)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.MFRNumber);
            if (exportedFields.Contains(nameof(ExportedFields.TDNo)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.TDNumber);
            if (exportedFields.Contains(nameof(ExportedFields.Quantity)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.Quantity.ToString());
            if (exportedFields.Contains(nameof(ExportedFields.UnitCost)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.UnitPrice?.ToString());
            if (exportedFields.Contains(nameof(ExportedFields.Freight)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, notAvailable);
            if (exportedFields.Contains(nameof(ExportedFields.ExtendedCost)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.ExtendedPrice);
            if (exportedFields.Contains(nameof(ExportedFields.Status)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.Status ?? string.Empty);// Status
            if (exportedFields.Contains(nameof(ExportedFields.Tracking)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, firstTracking.TrackingNumber); // Tracking
            if (exportedFields.Contains(nameof(ExportedFields.Carrier)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, firstTracking.Carrier); // Carrier
            if (exportedFields.Contains(nameof(ExportedFields.ShipDate)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, firstTracking.Date.HasValue ? firstTracking.Date.Value.ToString() : notAvailable); // ship date
            if (exportedFields.Contains(nameof(ExportedFields.Invoice)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, firstTracking.InvoiceNumber); //  Invoice
            if (exportedFields.Contains(nameof(ExportedFields.SerialNo)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, string.Join(',', line.Serials)); // Serial nums
            if (exportedFields.Contains(nameof(ExportedFields.LicenseKeys)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.License); // License keys
            if (exportedFields.Contains(nameof(ExportedFields.VendorOrderNo)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, notAvailable); // Vendor Order#
            if (exportedFields.Contains(nameof(ExportedFields.TDPurchaseOrderNo)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, model.PONumber); // TD PO#
            if (exportedFields.Contains(nameof(ExportedFields.ContractNo)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, notAvailable); //Contract
            if (exportedFields.Contains(nameof(ExportedFields.StartDate)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.StartDate == DateTime.MinValue ? notAvailable : line.StartDate.ToString()); // StartDate
            if (exportedFields.Contains(nameof(ExportedFields.EndDate)))
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.EndDate == DateTime.MinValue ? notAvailable : line.EndDate.ToString()); //EndDate
        }

        private void GenerateOrderDetailsSubHeader(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail, List<string> exportedFields)
        {
            int curCol = xlCol;
            int curRow = xlRow + 18;
            curCol++;
            SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "LINE");
            if (exportedFields.Contains(nameof(ExportedFields.MFRNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "MFR#");
            }
            if (exportedFields.Contains(nameof(ExportedFields.TDNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "TD#");
            }
            if (exportedFields.Contains(nameof(ExportedFields.Quantity)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "QTY");
            }
            if (exportedFields.Contains(nameof(ExportedFields.UnitCost)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "UNIT COST");
            }
            if (exportedFields.Contains(nameof(ExportedFields.Freight)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "FREIGHT");
            }
            if (exportedFields.Contains(nameof(ExportedFields.ExtendedCost)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "EXTENDED COST");
            }

            if (exportedFields.Contains(nameof(ExportedFields.Status)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "STATUS");
            }
            if (exportedFields.Contains(nameof(ExportedFields.Tracking)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "TRACKING");
            }
            if (exportedFields.Contains(nameof(ExportedFields.Carrier)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "CARRIER");
            }
            if (exportedFields.Contains(nameof(ExportedFields.ShipDate)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "SHIP DATE / ESTIMATED SHIP DATE");
            }
            if (exportedFields.Contains(nameof(ExportedFields.Invoice)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "INVOICE");
            }
            if (exportedFields.Contains(nameof(ExportedFields.SerialNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "SERIAL NUMBERS");
            }
            if (exportedFields.Contains(nameof(ExportedFields.LicenseKeys)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "LICENSE KEYS");
            }
            if (exportedFields.Contains(nameof(ExportedFields.VendorOrderNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "VENDOR ORDER#");
            }
            if (exportedFields.Contains(nameof(ExportedFields.TDPurchaseOrderNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "TD PO#");
            }
            if (exportedFields.Contains(nameof(ExportedFields.ContractNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "CONTRACT");
            }
            if (exportedFields.Contains(nameof(ExportedFields.StartDate)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "START DATE");
            }
            if (exportedFields.Contains(nameof(ExportedFields.EndDate)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "END DATE");
            }
            var subheaderRng = wsOrderDetail.Cells[curRow, xlCol + 1, curRow, curCol];
            subheaderRng.Style.Border.BorderAround(ExcelBorderStyle.Thin);
        }

        private void GenerateOrderDetailsHeader(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail)
        {
            SetOrderHeaderStyle(xlRow + 16, xlCol, xlRow + 16, xlCol + 19, wsOrderDetail, "Order Details");
            ExcelRange headerRange = wsOrderDetail.Cells[xlRow + 16, xlCol, xlRow + 16, xlCol + 19];
            headerRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
        }

        private void GenerateEndUserShipToDetailSection(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail, Address endUser, Address shipTo)
        {
            SetCell(xlRow + 11, xlCol + 2, wsOrderDetail, "End Customer:");
            SetCell(xlRow + 11, xlCol + 3, wsOrderDetail, endUser.CompanyName);
            SetCell(xlRow + 12, xlCol + 2, wsOrderDetail, "End Customer Address:");
            SetCell(xlRow + 12, xlCol + 3, wsOrderDetail, endUser.Line1);
            SetCell(xlRow + 13, xlCol + 2, wsOrderDetail, "City, State, ZIP, Country:");
            SetCell(xlRow + 13, xlCol + 3, wsOrderDetail, $"{endUser.City}, {endUser.State} {endUser.Zip}, {endUser.Country}");
            SetCell(xlRow + 14, xlCol + 2, wsOrderDetail, "End Customer Phone:");
            SetCell(xlRow + 14, xlCol + 3, wsOrderDetail, endUser.PhoneNumber);
            SetCell(xlRow + 11, xlCol + 11, wsOrderDetail, "Ship To:");
            SetCell(xlRow + 11, xlCol + 12, wsOrderDetail, shipTo.CompanyName);
            SetCell(xlRow + 12, xlCol + 11, wsOrderDetail, "Ship To Address:");
            SetCell(xlRow + 12, xlCol + 12, wsOrderDetail, shipTo.Line1);
            SetCell(xlRow + 13, xlCol + 11, wsOrderDetail, "City,State,ZIP,Country:");
            SetCell(xlRow + 13, xlCol + 12, wsOrderDetail, $"{shipTo.City}, {shipTo.State} {shipTo.Zip}, {shipTo.Country}");
            SetCell(xlRow + 14, xlCol + 11, wsOrderDetail, "Ship To Phone:");
            SetCell(xlRow + 14, xlCol + 12, wsOrderDetail, shipTo.PhoneNumber);
        }

        private void GenerateOrderDetailSection(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail, string orderNumber, string poDate, string poNumber, string endUserPO)
        {
            SetCell(xlRow + 4, xlCol + 1, wsOrderDetail, "Order#");
            SetCell(xlRow + 4, xlCol + 2, wsOrderDetail, orderNumber);
            SetCell(xlRow + 5, xlCol + 1, wsOrderDetail, "Placed On");
            SetCell(xlRow + 5, xlCol + 2, wsOrderDetail, poDate);
            SetCell(xlRow + 6, xlCol + 1, wsOrderDetail, "PO#");
            SetCell(xlRow + 6, xlCol + 2, wsOrderDetail, poNumber);
            SetCell(xlRow + 7, xlCol + 1, wsOrderDetail, "End Customer PO#");
            SetCell(xlRow + 7, xlCol + 2, wsOrderDetail, endUserPO);
        }

        private static void SetCell(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail, string value)
        {
            ExcelRange rng = wsOrderDetail.Cells[xlRow, xlCol];
            rng.Value = value;
            rng.Style.Font.Size = 11;
            rng.Style.Font.Name = "Calibri";
        }

        private void GenerateEndUserShipToDetailHeader(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail)
        {
            ExcelRange headerRange = wsOrderDetail.Cells[xlRow + 11, xlCol, xlRow + 11, xlCol + 19];
            SetOrderHeaderStyle(xlRow + 11, xlCol, xlRow + 11, xlCol + 19, wsOrderDetail, "End User & Ship to Details");
            headerRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
        }

        private void GenerateOrderReportHeader(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail)
        {
            ExcelRange rng = wsOrderDetail.Cells[xlRow, xlCol, xlRow, xlCol + 11];
            rng.Merge = true;
            rng.Value = "Tech Data Order Details";
            rng.Style.Font.Size = 22;
            rng.Style.Font.Name = "Lato Regular";
            rng.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
            wsOrderDetail.Row(xlRow).Height = 66;
            wsOrderDetail.Cells[xlRow, xlCol].Style.WrapText = false;

            rng = wsOrderDetail.Cells[xlRow, xlCol + 12, xlRow, xlCol + 19];
            rng.Merge = true;
            rng.Style.VerticalAlignment = ExcelVerticalAlignment.Bottom;
            wsOrderDetail.Row(xlRow).Height = 66;
            wsOrderDetail.Cells[xlRow, xlCol].Style.WrapText = false;
        }
        private void GenerateOrderDetailHeader(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail)
        {
            var headerRange = wsOrderDetail.Cells[xlRow + 2, xlCol, xlRow + 2, xlCol + 19];
            SetOrderHeaderStyle(xlRow + 2, xlCol, xlRow + 2, xlCol + 19, wsOrderDetail, "PO# Please cancel test order Order Details");
            headerRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
        }

        private void SetOrderHeaderStyle(int xlRowStart, int xlColStart, int xlRowEnd, int xlColEnd, ExcelWorksheet wsOrderDetail, string text)
        {
            var headerRange = wsOrderDetail.Cells[xlRowStart, xlColStart, xlRowEnd, xlColEnd];
            headerRange.Merge = true;
            headerRange.Value = text;
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.Size = 10;
            headerRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            headerRange.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
            headerRange.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(197, 217, 241));
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
            wsQuoteDetail.Cells[xlRow + 6, xlCol + 1].Value = qd.Reseller.CompanyName ?? "Not Available";
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
            string checkpointQuoteId = quoteDetails.VendorReference.Where(s => s.Type.Equals("supplierQuoteRef", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value;
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
            if (quoteDetails.VendorReference == null || quoteDetails.VendorReference.Count == 0)
                return;

            if (quoteDetails.VendorReference.Any(s => s.Type.Equals("OriginalEstimateId", StringComparison.InvariantCultureIgnoreCase)))
                originalEstimateId = quoteDetails.VendorReference.Where(s => s.Type.Equals("OriginalEstimateId", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value;

            if (quoteDetails.VendorReference.Any(s => s.Type.Equals("DealIdentifier", StringComparison.InvariantCultureIgnoreCase)))
                quickQuoteDealId = quoteDetails.VendorReference.Where(s => s.Type.Equals("DealIdentifier", StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault().Value;

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
            var buffer = new Span<byte>(new byte[logo.Length]);
            var isValidImage = !string.IsNullOrEmpty(logo) ? Convert.TryFromBase64String(logo, buffer, out int bytesParsed) : false;

            if (isValidImage)
            {
                byte[] bytes = buffer.ToArray();

                using (var ms = new MemoryStream(bytes))
                {
                    return Image.FromStream(ms);
                }
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

        private void GetLineHeader(ref ExcelWorksheet wsQuoteDetail, ref int xlRow, ref string[] colsToExport)
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

        private static void MapLineLevelData(ref ExcelWorksheet sheet, Line line, int xlRow, string estimateDealId)
        {
            for (int column = 3; column < 15; column++)
            {
                SetCenterAlignment(sheet, xlRow, column);
            }

            if (!line.IsSubLine && !string.IsNullOrEmpty(line.DisplayLineNumber))
            {
                FillLineNumberData(sheet, line, xlRow);
            }
            else if (!string.IsNullOrEmpty(estimateDealId) && line.IsSubLine && !string.IsNullOrEmpty(line.DisplayLineNumber))
            {
                FillSubLineData(sheet, line, xlRow);
            }

            StyleAndInsertRow(sheet, xlRow);
        }

        private static string ConvertTDNumber(string tdNumber)
        {
            var result = "Not available";

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
            sheet.Cells[xlRow, 5].Value = !string.IsNullOrEmpty(line.VendorPartNo) ? line.VendorPartNo : "Not available";
            sheet.Cells[xlRow, 6].Value = "n/a";
            sheet.Cells[xlRow, 7].Value = "n/a";
            sheet.Cells[xlRow, 8].Value = "n/a";
            sheet.Cells[xlRow, 9].Value = "n/a";

            sheet.Cells[xlRow, 10].Value = ConvertTDNumber(line.TDNumber);

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

        private static void FillLineNumberData(ExcelWorksheet sheet, Line line, int xlRow)
        {
            sheet.Cells[xlRow, 3].Value = line.DisplayLineNumber;
            sheet.Cells[xlRow, 3].Style.Numberformat.Format = "0.0";
            sheet.Cells[xlRow, 4].Value = !string.IsNullOrEmpty(line.Description) ? line.Description : "Not available";
            sheet.Cells[xlRow, 5].Value = !string.IsNullOrEmpty(line.VendorPartNo) ? line.VendorPartNo : "Not available";

            var startDate = line.Attributes.FirstOrDefault(a => a.Name.Equals("REQUESTEDSTARTDATE"))?.Value;
            sheet.Cells[xlRow, 6].Value = startDate ?? "n/a";

            var autoRenew = line.Attributes.FirstOrDefault(a => a.Name.Equals("AUTORENEWALTERM"))?.Value;
            sheet.Cells[xlRow, 7].Value = int.TryParse(autoRenew, out int autoRenewInt)
                ? autoRenewInt > 0 ? "Yes" : "No"
                : "n/a";

            var duration = line.Attributes.FirstOrDefault(a => a.Name.Equals("INITIALTERM"))?.Value;
            sheet.Cells[xlRow, 8].Value = duration != null ? duration + " months" : "n/a";

            var billing = line.Attributes.FirstOrDefault(a => a.Name.Equals("BILLINGTERM"))?.Value;
            sheet.Cells[xlRow, 9].Value = billing != null ? billing.Replace(" Billing", "") : "n/a";

            sheet.Cells[xlRow, 10].Value = ConvertTDNumber(line.TDNumber);
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
