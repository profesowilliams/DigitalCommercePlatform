//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Quote
{
    [ExcludeFromCodeCoverage]
    public class QuoteDetails
    {
        public Address ShipTo { get; set; }
        public Address EndUser { get; set; }
        public Address Reseller { get; set; }
        public List<VendorReferenceModel> VendorReference { get; set; }
        public List<AttributeModel> Attributes { get; set; }
        public string Notes { get; set; }
        public List<Line> Items { get; set; }
        public string Id { get; set; }
        public List<OrderModel> Orders { get; set; }
        public string CustomerPO { get; set; }
        public string EndUserPO { get; set; }
        public string QuoteReference { get; set; }
        public string SPAId { get; set; }
        public string Currency { get; set; } = "USD";
        public decimal SubTotal { get; set; }
        public string SubTotalFormatted { get; set; }
        public string Tier { get; set; }
        public string Created { get; set; }
        public string Expires { get; set; }
    }
}
