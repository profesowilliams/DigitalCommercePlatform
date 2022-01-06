//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote
{
    [ExcludeFromCodeCoverage]
    public class QuoteDetailModel
    {
        public QuoteDetails QuoteDetails { get; set; }
    }
    public class QuoteDetails
    {
        public Address ShipTo { get; set; }
        public Address EndUser { get; set; }
        public Address Reseller { get; set; }
        public List<VendorReferenceModel> Source { get; set; }
        public string Notes { get; set; }
        public List<Line> Items { get; set; }
        public string Id { get; set; }
        public List<OrderModel> Orders { get; set; }
        public string CustomerPO { get; set; }
        public string EndUserPO { get; set; }
        public string PODate { get; set; }
        public string QuoteReference { get; set; }
        public string SPAId { get; set; }
        public string Currency { get; set; } = "USD";
        public string CurrencySymbol { get; set; } = "$";
        public decimal SubTotal { get; set; }
        public string SubTotalFormatted { get; set; }
        public string Tier { get; set; }
        public string Created { get; set; }
        public string Expires { get; set; }
        public string BuyMethod { get; set; }
        public List<string> Deals { get; set; }
        public List<AttributeModel> Attributes { get; set; }
        public bool? IsExclusive { get; set; }


    }

}
