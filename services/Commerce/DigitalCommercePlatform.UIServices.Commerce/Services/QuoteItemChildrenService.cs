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
            if (quotePreviewModel?.QuoteDetails?.Items == null)
            {
                return new List<Line>();
            }

            ApplyIdToItems(quotePreviewModel);

            var parents = quotePreviewModel.QuoteDetails.Items.Where(i => i.Parent == null).ToList();

            var lines = new List<Line>();
            double displayNumber = 0;
            double displayChildNumber = 0.0;

            foreach (var item in parents)
            {
                displayNumber = displayNumber + 1.0;
                item.DisplayLineNumber = displayNumber.ToString();

                var subLines = quotePreviewModel.QuoteDetails.Items.Where(i => (i.Parent == item.Id)).ToList();
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
                    Discounts = item.Discounts,
                    DisplayName = item.DisplayName,
                    DisplayLineNumber = item.DisplayLineNumber,
                    ExtendedPrice = item.ExtendedPrice,
                    Invoice = item.Invoice,
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
                    Images = item.Images,
                    Logos = item.Logos,
                    Children = subLines
                });

            }

            return lines;
        }

        private void ApplyIdToItems(QuotePreviewModel quotePreviewModel)
        {
            var linesWithoutId = quotePreviewModel.QuoteDetails.Items.Where(i => NullableTryParseDouble(i.Id) == 0.00).ToList();           

            if (linesWithoutId.Any())
            {
                var maxLineNumber = quotePreviewModel.QuoteDetails.Items.Where(i => i.Parent == null).ToList().OrderByDescending(i => NullableTryParseDouble(i.Id)).FirstOrDefault().Id;

                double parentNumber = 0;
                double n;
                bool isNumeric = double.TryParse(maxLineNumber, out n);
                if (isNumeric)
                {
                    parentNumber = n + 1.0;
                }

                foreach (var item in linesWithoutId)
                {
                    parentNumber = parentNumber + 1.0;
                    item.DisplayLineNumber = parentNumber.ToString();
                    item.Id = parentNumber.ToString();
                }
            }
        }

        private double? NullableTryParseDouble(string request)
        {
            if (string.IsNullOrWhiteSpace(request)) return 0.00;

            int index = request.IndexOf('.');
            if(index >0)
                request = request.Substring(0, index);

            double value;
            return double.TryParse(request, out value) ? (double?)value : 0.00;
        }
    }
}
