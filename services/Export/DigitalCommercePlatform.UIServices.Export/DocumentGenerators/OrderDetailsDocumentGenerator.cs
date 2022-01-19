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
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators
{
    [ExcludeFromCodeCoverage]
    public class OrderDetailsDocumentGenerator :
        DocumentGeneratorBase<IOrderDetailsDocumentGeneratorSettings, IOrderDetailsDocumentModel>,
        IOrderDetailsDocumentGenerator
    {
        protected override IOrderDetailsDocumentGeneratorSettings Settings { get; set; }

        private static readonly TrackingDetails _notAvailableTracking = new() { TrackingNumber = NOT_AVAILABLE, Carrier = NOT_AVAILABLE, InvoiceNumber = NOT_AVAILABLE };

        private static readonly int _col = 2;
        private static readonly int _row = 2;

        public OrderDetailsDocumentGenerator(IOrderDetailsDocumentGeneratorSettings settings)
        {
            Settings = settings;
        }

        public override Task<byte[]> XlsGenerate(IOrderDetailsDocumentModel orderDetails)
        {
            using var p = new ExcelPackage();
            ExcelWorksheet wsOrderDetail = p.Workbook.Worksheets.Add(Settings.WorkSheetName);
            p.Workbook.Worksheets.MoveToStart(Settings.WorkSheetName);

            GenerateOrderReportHeader(wsOrderDetail);
            GenerateOrderDetailHeader(wsOrderDetail);
            GenerateOrderDetailSection(wsOrderDetail, orderDetails);

            GenerateEndUserShipToDetailHeader(wsOrderDetail);
            GenerateEndUserShipToDetailSection(wsOrderDetail, orderDetails.EndUser?.First(), orderDetails.ShipTo);

            GenerateOrderDetailsHeader(wsOrderDetail);
            GenerateOrderDetailsSubHeader(wsOrderDetail, orderDetails.ExportedFields);
            int currentRow = GenerateOrderDetailsSection(wsOrderDetail, orderDetails);

            GeneratePaymentDetailsHeader(currentRow, wsOrderDetail);
            GeneratePaymentMethodSection(currentRow, wsOrderDetail);
            GeneratePaymentTotalSection(currentRow, wsOrderDetail, orderDetails.PaymentDetails);

            AdjustAllColumnWidths(wsOrderDetail);
            ExcelRange orderReport = wsOrderDetail.Cells[_row, _col, currentRow + 13, 21];
            orderReport.Style.Border.BorderAround(ExcelBorderStyle.Thick);

            return Task.FromResult(p.GetAsByteArray());
        }

        private void GeneratePaymentTotalSection(int currentRow, ExcelWorksheet wsOrderDetail, PaymentDetails paymentDetails)
        {
            ExcelRange headerRng = wsOrderDetail.Cells[currentRow + 4, _col + 13, currentRow + 4, _col + 18];
            SetOrderHeaderStyle(currentRow + 4, _col + 13, currentRow + 4, _col + 18, wsOrderDetail, "Total");
            headerRng.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

            SetCell(currentRow + 6, _col + 14, wsOrderDetail, "SubTotal");
            SetCell(currentRow + 6, _col + 15, wsOrderDetail, paymentDetails.Subtotal.Value.ToString());
            SetCell(currentRow + 7, _col + 14, wsOrderDetail, "Tax");
            SetCell(currentRow + 7, _col + 15, wsOrderDetail, paymentDetails.Tax.Value.ToString());
            SetCell(currentRow + 8, _col + 14, wsOrderDetail, "Freight");
            SetCell(currentRow + 8, _col + 15, wsOrderDetail, paymentDetails.Freight.Value.ToString());
            SetCell(currentRow + 9, _col + 14, wsOrderDetail, "OtherFees");
            SetCell(currentRow + 9, _col + 15, wsOrderDetail, paymentDetails.OtherFees.Value.ToString());
            SetCell(currentRow + 10, _col + 14, wsOrderDetail, "Total");
            SetCell(currentRow + 10, _col + 15, wsOrderDetail, paymentDetails.Total.Value.ToString());

            var rng = wsOrderDetail.Cells[currentRow + 4, _col + 13, currentRow + 11, _col + 18];
            rng.Style.Border.BorderAround(Settings.DefaultBorder);
        }

        private void GeneratePaymentMethodSection(int currentRow, ExcelWorksheet wsOrderDetail)
        {
            ExcelRange headerRng = wsOrderDetail.Cells[currentRow + 4, _col + 1, currentRow + 4, _col + 4];
            SetOrderHeaderStyle(currentRow + 4, _col + 1, currentRow + 4, _col + 4, wsOrderDetail, "Payment Method");
            headerRng.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

            ExcelRange rng = wsOrderDetail.Cells[currentRow + 6, _col + 1, currentRow + 11, _col + 4];
            rng.Merge = true;
            rng.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            rng.Style.Font.Bold = true;
            rng.Value = "30 days net";

            rng = wsOrderDetail.Cells[currentRow + 4, _col + 1, currentRow + 11, _col + 4];
            rng.Style.Border.BorderAround(Settings.DefaultBorder);
        }

        private void GeneratePaymentDetailsHeader(int currentRow, ExcelWorksheet wsOrderDetail)
        {
            //ExcelRange headerRng = wsOrderDetail.Cells[currentRow + 2, _col + 1, currentRow + 2, _col + 4];
            SetOrderHeaderStyle(currentRow + 2, _col + 1, currentRow + 2, _col + 4, wsOrderDetail, "Payment Details");
        }

        private int GenerateOrderDetailsSection(ExcelWorksheet wsOrderDetail, IOrderDetailsDocumentModel model)
        {
            int lineNumber = 1;
            foreach (var line in model.Lines)
            {
                SetLineData(wsOrderDetail, lineNumber, _row + 18 + lineNumber, line, model, line.Trackings.FirstOrDefault() ?? _notAvailableTracking);
                lineNumber++;
                
            }
            return _row + 18 + lineNumber;
        }

        private void SetLineData(ExcelWorksheet wsOrderDetail, int lineNumber, int curXlRow, Line line, 
            IOrderDetailsDocumentModel model, TrackingDetails firstTracking)
        {
            int curCol = _col;
            SetCell(curXlRow, ++curCol, wsOrderDetail, lineNumber.ToString());
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.MFRNo, line.MFRNumber);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.TDNo, line.TDNumber);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.Quantity, line.Quantity.ToString());
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.UnitCost, line.UnitPrice?.ToString());
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.Freight, NOT_AVAILABLE);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.ExtendedCost, line.ExtendedPrice);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.Status, line.Status ?? string.Empty);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.Tracking, firstTracking.TrackingNumber);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.Carrier, firstTracking.Carrier);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.ShipDate, firstTracking.Date.HasValue ? firstTracking.Date.Value.ToString() : NOT_AVAILABLE);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.Invoice, firstTracking.InvoiceNumber);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.SerialNo, string.Join(',', line.Serials));
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.LicenseKeys, line.License);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.VendorOrderNo, NOT_AVAILABLE);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.TDPurchaseOrderNo, model.PONumber);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.ContractNo, line.ContractNo);
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.StartDate, line.StartDate == DateTime.MinValue ? NOT_AVAILABLE : line.StartDate.ToString());
            curCol = CheckExportedFieldsAndSetCell(wsOrderDetail, curXlRow, model, curCol, OrderDetailsExportedFields.EndDate, line.EndDate == DateTime.MinValue ? NOT_AVAILABLE : line.EndDate.ToString());
        }

        private int CheckExportedFieldsAndSetCell(ExcelWorksheet wsOrderDetail, int curXlRow, IOrderDetailsDocumentModel model,
            int curCol, OrderDetailsExportedFields field, string text)
        {
            if (model.ExportedFields.Contains(field.ToString()))
            {
                SetCell(curXlRow, ++curCol, wsOrderDetail, text);
            }

            return curCol;
        }

        private void GenerateOrderDetailsSubHeader(ExcelWorksheet wsOrderDetail, List<string> exportedFields)
        {
            int curCol = _col + 1;
            int curRow = _row + 18;
            SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, "LINE");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.MFRNo, "MFR No");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.TDNo, "TD No");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.Quantity, "QTY");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.UnitCost, "UNIT COST");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.Freight, "FREIGHT");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.ExtendedCost, "EXTENDED COST");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.Status, "STATUS");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.Tracking, "TRACKING");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.Carrier, "CARRIER");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.ShipDate, "SHIP DATE / ESTIMATED SHIP DATE");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.Invoice, "INVOICE");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.SerialNo, "SERIAL NUMBERS");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.LicenseKeys, "LICENSE KEYS");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.VendorOrderNo, "VENDOR ORDER No");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.TDPurchaseOrderNo, "TD PO No");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.ContractNo, "CONTRACT No");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.StartDate, "START DATE");
            curCol = CheckExportedFieldAndSetOrderHeaderStyle(wsOrderDetail, exportedFields, curCol, curRow, OrderDetailsExportedFields.EndDate, "END DATE");
            
            var subheaderRng = wsOrderDetail.Cells[curRow, _col + 1, curRow, curCol];
            subheaderRng.Style.Border.BorderAround(Settings.DefaultBorder);
        }

        private int CheckExportedFieldAndSetOrderHeaderStyle(ExcelWorksheet wsOrderDetail, List<string> exportedFields, int curCol, int curRow, OrderDetailsExportedFields field, string text)
        {
            if (exportedFields.Contains(field.ToString()))
            {
                curCol++;
                SetOrderHeaderStyle(curRow, curCol, curRow, curCol, wsOrderDetail, text);
            }

            return curCol;
        }

        private void GenerateOrderDetailsHeader(ExcelWorksheet wsOrderDetail)
        {
            SetOrderHeaderStyle(_row + 16, _col, _row + 16, _col + 19, wsOrderDetail, "Order Details");
            ExcelRange headerRange = wsOrderDetail.Cells[_row + 16, _col, _row + 16, _col + 19];
            headerRange.Style.Border.BorderAround(Settings.DefaultBorder);
        }

        private void GenerateEndUserShipToDetailSection(ExcelWorksheet wsOrderDetail, Address endUser, Address shipTo)
        {
            SetCell(_row + 11, _col + 2, wsOrderDetail, "End Customer:");
            SetCell(_row + 11, _col + 3, wsOrderDetail, endUser.CompanyName);
            SetCell(_row + 12, _col + 2, wsOrderDetail, "End Customer Address:");
            SetCell(_row + 12, _col + 3, wsOrderDetail, endUser.Line1);
            SetCell(_row + 13, _col + 2, wsOrderDetail, "City, State, ZIP, Country:");
            SetCell(_row + 13, _col + 3, wsOrderDetail, $"{endUser.City}, {endUser.State} {endUser.Zip}, {endUser.Country}");
            SetCell(_row + 14, _col + 2, wsOrderDetail, "End Customer Phone:");
            SetCell(_row + 14, _col + 3, wsOrderDetail, endUser.PhoneNumber);
            SetCell(_row + 11, _col + 11, wsOrderDetail, "Ship To:");
            SetCell(_row + 11, _col + 12, wsOrderDetail, shipTo.CompanyName);
            SetCell(_row + 12, _col + 11, wsOrderDetail, "Ship To Address:");
            SetCell(_row + 12, _col + 12, wsOrderDetail, shipTo.Line1);
            SetCell(_row + 13, _col + 11, wsOrderDetail, "City,State,ZIP,Country:");
            SetCell(_row + 13, _col + 12, wsOrderDetail, $"{shipTo.City}, {shipTo.State} {shipTo.Zip}, {shipTo.Country}");
            SetCell(_row + 14, _col + 11, wsOrderDetail, "Ship To Phone:");
            SetCell(_row + 14, _col + 12, wsOrderDetail, shipTo.PhoneNumber);
        }

        private void GenerateOrderDetailSection(ExcelWorksheet wsOrderDetail, IOrderDetailsDocumentModel orderDetails)
        {
            SetCell(_row + 4, _col + 1, wsOrderDetail, "Order No");
            SetCell(_row + 4, _col + 2, wsOrderDetail, orderDetails.OrderNumber);
            SetCell(_row + 5, _col + 1, wsOrderDetail, "Placed On");
            SetCell(_row + 5, _col + 2, wsOrderDetail, orderDetails.PODate);
            SetCell(_row + 6, _col + 1, wsOrderDetail, "PO No");
            SetCell(_row + 6, _col + 2, wsOrderDetail, orderDetails.PONumber);
            SetCell(_row + 7, _col + 1, wsOrderDetail, "End Customer PO No");
            SetCell(_row + 7, _col + 2, wsOrderDetail, orderDetails.EndUserPO);
        }

        private void SetCell(int xlRow, int xlCol, ExcelWorksheet wsOrderDetail, string value)
        {
            ExcelRange rng = wsOrderDetail.Cells[xlRow, xlCol];
            rng.Value = value;
            rng.Style.Font.Size = Settings.CellFontSize;
            rng.Style.Font.Name = Settings.CellFontName;
        }

        private void GenerateEndUserShipToDetailHeader(ExcelWorksheet wsOrderDetail)
        {
            ExcelRange headerRange = wsOrderDetail.Cells[_row + 11, _col, _row + 11, _col + 19];
            SetOrderHeaderStyle(_row + 11, _col, _row + 11, _col + 19, wsOrderDetail, "End User & Ship to Details");
            headerRange.Style.Border.BorderAround(Settings.DefaultBorder);
        }

        private void GenerateOrderReportHeader(ExcelWorksheet wsOrderDetail)
        {
            ExcelRange rng = wsOrderDetail.Cells[_row, _col, _row, _col + 11];
            rng.Merge = true;
            rng.Value = "Tech Data Order Details";
            rng.Style.Font.Size = Settings.HeaderFontSize;
            rng.Style.Font.Name = Settings.HeaderFontName;
            rng.Style.VerticalAlignment = Settings.HeaderVerticalAlignment;
            wsOrderDetail.Row(_row).Height = Settings.HeaderRowHeight;
            wsOrderDetail.Cells[_row, _col].Style.WrapText = false;

            rng = wsOrderDetail.Cells[_row, _col + 12, _row, _col + 19];
            rng.Merge = true;
            rng.Style.VerticalAlignment = Settings.HeaderVerticalAlignment;
            wsOrderDetail.Row(_row).Height = Settings.HeaderRowHeight;
            wsOrderDetail.Cells[_row, _col].Style.WrapText = false;
        }

        private void GenerateOrderDetailHeader(ExcelWorksheet wsOrderDetail)
        {
            var headerRange = wsOrderDetail.Cells[_row + 2, _col, _row + 2, _col + 19];
            SetOrderHeaderStyle(_row + 2, _col, _row + 2, _col + 19, wsOrderDetail,
                "PO No Please cancel test order Order Details");
            headerRange.Style.Border.BorderAround(Settings.DefaultBorder);
        }

        private void SetOrderHeaderStyle(int xlRowStart, int xlColStart, int xlRowEnd, int xlColEnd, ExcelWorksheet wsOrderDetail, string text)
        {
            var headerRange = wsOrderDetail.Cells[xlRowStart, xlColStart, xlRowEnd, xlColEnd];
            headerRange.Merge = true;
            headerRange.Value = text;
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.Size = Settings.HeaderFontSize;
            headerRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            headerRange.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
            headerRange.Style.Fill.BackgroundColor.SetColor(Settings.DefaultBackgroundColor);
        }

        private static void AdjustAllColumnWidths(ExcelWorksheet wsOrderDetail)
        {
            for (int col = 1; col <= 22; col++)
            {
                wsOrderDetail.Column(col).AutoFit();
            }
        }
    }
}
