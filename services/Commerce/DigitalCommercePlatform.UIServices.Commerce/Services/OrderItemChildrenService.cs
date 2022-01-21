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
        private readonly IHelperService _helperQueryService;
        public OrderItemChildrenService(ISubstringService substringService, IHelperService helperQueryService)
        {
            _substringService = substringService ?? throw new ArgumentNullException(nameof(substringService));
            _helperQueryService = helperQueryService ?? throw new ArgumentNullException(nameof(helperQueryService));
        }
        public List<Line> GetOrderLinesWithChildren(GetOrder.Response orderDetails)
        {
            if (orderDetails?.Items == null)
            {
                return new List<Line>();
            }

            var parents = orderDetails.Items.Where(i => i.Parent == "0" || i.Parent == null).ToList().OrderBy(o => o.Id);

            var lines = new List<Line>();
            double displayNumber = 0;
            double displayChildNumber = 0.0;
            foreach (var item in parents)
            {
                displayNumber = displayNumber + 1.0;
                item.DisplayLineNumber = displayNumber.ToString();
                var subLines = orderDetails.Items.Where(i => (i.Parent == item.Id))?.ToList();
                var sublineTracking = GetSubLineTracking(subLines ?? new List<Line>());
                // If there are no tracking info at the parent but there are some on the children, create an empty list to add to
                if (sublineTracking.Any() && item.Trackings == null)
                {
                    item.Trackings = new List<Models.Order.TrackingDetails>();
                }
                item.Trackings?.AddRange(sublineTracking);

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
                    TDNumber = string.IsNullOrWhiteSpace(item.TDNumber) ? string.Empty : item.TDNumber.TrimStart('0'),
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
                    ShipDates = item.ShipDates,
                    PAKs = item.PAKs,
                    Trackings = item.Trackings,
                    Children = subLines,
                    Authorization = item.Authorization,
                    DisplayName = item.DisplayName,
                    Images = item.Images,
                    Logos = item.Logos
                });

            }
            return lines;
        }

        private List<Models.Order.TrackingDetails> GetSubLineTracking(List<Line> subLines)
        {
            var trackingDetails = new List<Models.Order.TrackingDetails>();
            subLines.ForEach(line =>
            {
                if (line.Trackings != null)
                {
                    trackingDetails.AddRange(line.Trackings);
                }
            });
            return trackingDetails;
        }
    }
}
