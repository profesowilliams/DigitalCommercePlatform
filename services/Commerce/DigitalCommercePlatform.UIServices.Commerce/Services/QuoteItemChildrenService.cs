//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using System.Collections.Generic;
using System.Linq;
using System;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public class QuoteItemChildrenService : IQuoteItemChildrenService
    {
        private readonly ISubstringService _substringService;

        public QuoteItemChildrenService(ISubstringService substringService)
        {
            _substringService = substringService ?? throw new ArgumentNullException(nameof(substringService));
        }
        public List<Line> GetQuoteLinesWithChildren(QuotePreviewModel quotePreviewModel)
        {
            if(quotePreviewModel?.QuoteDetails?.Items == null)
            {
                return new List<Line>();
            }

            var parents = quotePreviewModel.QuoteDetails.Items.Where(i => i.Parent == null).ToList();

            var lines = new List<Line>();

            foreach (var item in parents)
            {
                var children = quotePreviewModel.QuoteDetails.Items.Where(i => i.Parent != null && 
                            _substringService.GetSubstring(i.Id,".") == _substringService.GetSubstring(item.Id, ".")).ToList();

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
