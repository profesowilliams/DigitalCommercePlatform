//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public class OrderItemChildrenService : IOrderItemChildrenService
    {
        private readonly ISubstringService _substringService;

        public OrderItemChildrenService(ISubstringService substringService)
        {
            _substringService = substringService ?? throw new ArgumentNullException(nameof(substringService));
        }
        public List<Line> GetOrderLinesWithChildren(GetOrder.Response orderDetails)
        {
            if (orderDetails?.Items == null)
            {
                return new List<Line>();
            }

            var parents = orderDetails.Items.Where(i => i.Parent == "0" || i.Parent == null).ToList().OrderBy(o=>o.Id);

            var lines = new List<Line>();
            double displayNumber = 0;
            double displayChildNumber = 0.0;
            foreach (var item in parents)
            {
                displayNumber = displayNumber + 1.0;
                item.DisplayLineNumber = displayNumber.ToString();
                var subLines = orderDetails.Items.Where(i => (i.Parent == item.Id)).ToList();
                foreach (var child in subLines)
                {
                    displayChildNumber = displayChildNumber + 0.1;
                    child.DisplayLineNumber = (displayNumber + displayChildNumber).ToString();
                }


                lines.Add(new Line
                {
                    Id = item.Id,
                    Parent = item.Parent,
                    Availability = item.Availability,
                    Description = item.Description,
                    DisplayLineNumber = item.DisplayLineNumber,
                    Discounts = item.Discounts,
                    ExtendedPrice = item.ExtendedPrice,
                    Invoice = item.Invoice,
                    Invoices = item.Invoices,
                    Manufacturer = item.Manufacturer,
                    MFRNumber = item.MFRNumber,
                    MSRP = item.MSRP,
                    Quantity = item.Quantity,
                    RebateValue = item.RebateValue,
                    ShortDescription = item.ShortDescription,
                    TDNumber = item.TDNumber,
                    TotalPrice = item.TotalPrice,
                    UnitListPrice = item.UnitListPrice,
                    UnitListPriceFormatted = item.UnitListPriceFormatted,
                    UnitPrice = item.UnitPrice,
                    UPCNumber = item.UPCNumber,
                    URLProductImage = item.URLProductImage,
                    URLProductSpecs = item.URLProductSpecs,
                    VendorPartNo = item.VendorPartNo,
                    LicenseStartDate = item.LicenseStartDate,
                    LicenseEndDate = item.LicenseEndDate,
                    ContractStartDate = item.ContractStartDate,
                    ContractEndDate = item.ContractEndDate,
                    ContractNo = item.ContractNo,
                    ContractType = item.ContractType,
                    License = item.License,
                    VendorStatus = item.VendorStatus,
                    Status = item.Status ?? string.Empty,
                    CustomerPOLine = item.CustomerPOLine,
                    SupplierQuoteRef = item.SupplierQuoteRef,
                    ConfigID = item.ConfigID,
                    LocationID = item.LocationID,
                    Serials = item.Serials,
                    PAKs = item.PAKs,
                    Trackings = item.Trackings,
                    Children = subLines
                });

            }

            return lines;
        }
    }
}
