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

            var parents = orderDetails.Items.Where(i => i.Parent == "0" || i.Parent == null).ToList();

            var lines = new List<Line>();

            foreach (var item in parents)
            {
                var children = orderDetails.Items.Where(i => (i.Parent != null && i.Parent!="0") &&
                            _substringService.GetSubstring(i.Parent, ".") == _substringService.GetSubstring(item.Id, ".")).ToList();

                lines.Add(new Line
                {
                    Id = item.Id,
                    Parent = item.Parent,
                    Availability = item.Availability,
                    Description = item.Description,
                    Discounts = item.Discounts,
                    ExtendedPrice = item.ExtendedPrice,
                    Invoice = item.Invoice,
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
                    Children = children
                });

            }

            return lines;
        }
    }
}
