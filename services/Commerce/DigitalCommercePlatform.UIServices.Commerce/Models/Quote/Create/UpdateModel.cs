//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create
{
    [ExcludeFromCodeCoverage]
    public class UpdateModel
    {
        public string QuoteId { get; set; }
        // Pricing conditions
        public TypeModel Type { get; set; }
        public ShipToModel ShipTo { get; set; }
        public EndUserModel EndUser { get; set; }
        public VendorReferenceModel VendorReference { get; set; }
    }
}
