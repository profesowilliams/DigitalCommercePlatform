//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Abstract;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Models.Enums;
using DigitalCommercePlatform.UIServices.Export.Models;
using DigitalCommercePlatform.UIServices.Export.Models.Order;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators
{
    [ExcludeFromCodeCoverage]
    public class OrderDetailsDocumentGenerator :
        DocumentGeneratorBase<IOrderDetailsDocumentGeneratorSettings, IOrderDetailsDocumentModel>,
        IOrderDetailsDocumentGenerator
    {
        protected override IOrderDetailsDocumentGeneratorSettings _settings { get; set; }

        public OrderDetailsDocumentGenerator(IOrderDetailsDocumentGeneratorSettings settings)
        {
            _settings = settings;
        }

        public override Task<byte[]> XlsGenerate(IOrderDetailsDocumentModel orderDetails)
        {
            int xlRow = 2;
            int xlCol = 2;

            using var p = new ExcelPackage();
            ExcelWorksheet wsOrderDetail = p.Workbook.Worksheets.Add(_settings.WorkSheetName);
            p.Workbook.Worksheets.MoveToStart(_settings.WorkSheetName);

            GenerateOrderReportHeader(xlRow, xlCol, wsOrderDetail);

            GenerateOrderDetailHeader(xlRow, xlCol, wsOrderDetail);
            GenerateOrderDetailSection(xlRow, xlCol, wsOrderDetail, orderDetails.OrderNumber, orderDetails.PODate, orderDetails.PONumber, orderDetails.EndUserPO);

            GenerateEndUserShipToDetailHeader(xlRow, xlCol, wsOrderDetail);
            GenerateEndUserShipToDetailSection(xlRow, xlCol, wsOrderDetail, orderDetails.EndUser?.First(), orderDetails.ShipTo);

            GenerateOrderDetailsHeader(xlRow, xlCol, wsOrderDetail);
            GenerateOrderDetailsSubHeader(xlRow, xlCol, wsOrderDetail, orderDetails.ExportedFields);
            int currentRow = GenerateOrderDetailsSection(xlRow, xlCol, wsOrderDetail, orderDetails, orderDetails.ExportedFields);

            GeneratePaymentDetailsHeader(currentRow, xlCol, wsOrderDetail);
            GeneratePaymentMethodSection(currentRow, xlCol, wsOrderDetail);
            GeneratePaymentTotalSection(currentRow, xlCol, wsOrderDetail, orderDetails.PaymentDetails);

            AdjustAllColumnWidths(wsOrderDetail);
            ExcelRange orderReport = wsOrderDetail.Cells[2, 2, currentRow + 13, 21];
            orderReport.Style.Border.BorderAround(ExcelBorderStyle.Thick);

            return Task.FromResult(p.GetAsByteArray());
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

        private int GenerateOrderDetailsSection(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail, IOrderDetailsDocumentModel model, List<string> exportedFields)
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

        private void SetLineData(int xlCol, ExcelWorksheet wsOrderDetail, int lineNumber, int curXlRow, string notAvailable, Line line, IOrderDetailsDocumentModel model, List<string> exportedFields)
        {
            int curCol = xlCol;
            var firstTracking = line.Trackings.Count() > 0 ? line.Trackings.First() : new TrackingDetails() { TrackingNumber = notAvailable, Carrier = notAvailable, InvoiceNumber = notAvailable };
            SetCell(curXlRow, ++curCol, wsOrderDetail, lineNumber.ToString());
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.MFRNo)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.MFRNumber);
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.TDNo)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.TDNumber);
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Quantity)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.Quantity.ToString());
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.UnitCost)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.UnitPrice?.ToString());
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Freight)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, notAvailable);
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.ExtendedCost)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.ExtendedPrice);
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Status)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.Status ?? string.Empty);// Status
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Tracking)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, firstTracking.TrackingNumber); // Tracking
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Carrier)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, firstTracking.Carrier); // Carrier
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.ShipDate)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, firstTracking.Date.HasValue ? firstTracking.Date.Value.ToString() : notAvailable); // ship date
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Invoice)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, firstTracking.InvoiceNumber); //  Invoice
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.SerialNo)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, string.Join(',', line.Serials)); // Serial nums
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.LicenseKeys)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.License); // License keys
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.VendorOrderNo)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, notAvailable); // Vendor Order#
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.TDPurchaseOrderNo)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, model.PONumber); // TD PO#
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.ContractNo)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.ContractNo); //Contract
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.StartDate)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.StartDate == DateTime.MinValue ? notAvailable : line.StartDate.ToString()); // StartDate
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.EndDate)))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, line.EndDate == DateTime.MinValue ? notAvailable : line.EndDate.ToString()); //EndDate
            }
        }

        private void GenerateOrderDetailsSubHeader(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail, List<string> exportedFields)
        {
            int curCol = xlCol;
            int curRow = xlRow + 18;
            curCol++;
            SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "LINE");
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.MFRNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "MFR#");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.TDNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "TD#");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Quantity)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "QTY");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.UnitCost)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "UNIT COST");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Freight)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "FREIGHT");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.ExtendedCost)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "EXTENDED COST");
            }

            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Status)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "STATUS");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Tracking)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "TRACKING");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Carrier)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "CARRIER");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.ShipDate)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "SHIP DATE / ESTIMATED SHIP DATE");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.Invoice)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "INVOICE");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.SerialNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "SERIAL NUMBERS");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.LicenseKeys)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "LICENSE KEYS");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.VendorOrderNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "VENDOR ORDER#");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.TDPurchaseOrderNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "TD PO#");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.ContractNo)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "CONTRACT");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.StartDate)))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "START DATE");
            }
            if (exportedFields.Contains(nameof(OrderDetailsExportedFields.EndDate)))
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

        private void SetCell(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail, string value)
        {
            ExcelRange rng = wsOrderDetail.Cells[xlRow, xlCol];
            rng.Value = value;
            rng.Style.Font.Size = _settings.CellFontSize;
            rng.Style.Font.Name = _settings.CellFontName;
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
            rng.Style.Font.Size = _settings.HeaderFontSize;
            rng.Style.Font.Name = _settings.HeaderFontName;
            rng.Style.VerticalAlignment = _settings.HeaderVerticalAlignment;
            wsOrderDetail.Row(xlRow).Height = _settings.HeaderRowHeight;
            wsOrderDetail.Cells[xlRow, xlCol].Style.WrapText = false;

            rng = wsOrderDetail.Cells[xlRow, xlCol + 12, xlRow, xlCol + 19];
            rng.Merge = true;
            rng.Style.VerticalAlignment = _settings.HeaderVerticalAlignment;
            wsOrderDetail.Row(xlRow).Height = _settings.HeaderRowHeight;
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

        private static void AdjustAllColumnWidths(ExcelWorksheet wsOrderDetail)
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
    }
}
