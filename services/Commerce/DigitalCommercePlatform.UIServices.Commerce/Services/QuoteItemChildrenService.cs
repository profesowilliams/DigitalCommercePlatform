//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
                return new List<Line>();


            ApplyIdToItems(quotePreviewModel);

            var parents = quotePreviewModel.QuoteDetails.Items.Where(i => i.Parent == null).ToList();

            var lines = new List<Line>();

            foreach (var item in parents)
            {

                var subLines = quotePreviewModel.QuoteDetails.Items.Where(i => (i.Parent == item.Id)).ToList();
                var childLines = new List<Line>();
                MapChildrenFromParents(quotePreviewModel, subLines, childLines);

                lines.Add(new Line
                {
                    Annuity = item.Annuity,
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
                    Children = subLines,
                    Authorization = item.Authorization,
                    PurchaseCost = item.PurchaseCost,
                });

            }
            return lines;
        }

        private void MapChildrenFromParents(QuotePreviewModel quotePreviewModel, List<Line> subLines, List<Line> childLines)
        {
            foreach (var child in subLines)
            {
                var childSubLineParents = quotePreviewModel.QuoteDetails?.Items?.Where(i => i.Parent == child.Id)?.ToList();
                childLines.AddRange(childSubLineParents);
            }
            if (childLines.Count > 0)
                subLines.AddRange(childLines);
        }
        private void ApplyIdToItems(QuotePreviewModel quotePreviewModel)
        {

            Parallel.ForEach(quotePreviewModel.QuoteDetails.Items,
                new ParallelOptions { MaxDegreeOfParallelism = 3 }, item =>
                {
                    var parent = item?.Attributes?.Where(a => a.Name.ToUpper().Equals("CONFIGPARENT")).FirstOrDefault()?.Value;
                    
                    if (!string.IsNullOrWhiteSpace(parent))
                    {
                        var id = NullableTryParseDouble(item.Id);
                        if (id != null)
                        {
                            double parentNumber = 0;

                            if (id != parentNumber)
                                item.Parent = parent;
                            else
                                item.Parent = null;
                        }
                    }

                    var configLine = item?.Attributes?.Where(a => a.Name.ToUpper().Equals("CONFIGLINE")).FirstOrDefault()?.Value;
                    if (!string.IsNullOrWhiteSpace(configLine))
                    {
                        item.DisplayLineNumber = configLine;
                        item.Id = item.DisplayLineNumber;
                    }

                });
        }

        private double? NullableTryParseDouble(string request)
        {
            if (string.IsNullOrWhiteSpace(request)) return 0.00;

            int index = request.IndexOf('.');
            if (index > 0)
                request = request.Substring(0, index);

            double value;
            return double.TryParse(request, out value) ? (double?)value : 0.00;
        }
    }
}
