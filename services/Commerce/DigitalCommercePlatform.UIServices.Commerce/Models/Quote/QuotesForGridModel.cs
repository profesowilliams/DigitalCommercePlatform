//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote
{
    [ExcludeFromCodeCoverage]
    public class QuotesForGridModel
    {
        public string Id { get; set; }
        public string QuoteReference { get; set; }
        public string Vendor { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Expires { get; set; }
        public string EndUserName { get; set; }
        public List<AgreementModel> Deals { get; set; }
        public string Status { get; set; }
        public double QuoteValue { get; set; }
        public string FormatedQuoteValue { get; set; }
        public string Currency { get; set; }
        public string CurrencySymbol { get; set; } = "$";
        public bool CanUpdate { get; set; } = true;
        public bool CanCheckOut { get; set; } = true;
    }

    [ExcludeFromCodeCoverage]
    public class AgreementModel
    {
        public string Id { get; set; }
        public string Version { get; set; }
        public string VendorId { get; set; }
        public string SelectionFlag { get; set; }
    }
}
