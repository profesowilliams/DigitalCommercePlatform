using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.SPA
{
    [ExcludeFromCodeCoverage]
    public class SPAResponse
    {
        public string DealId { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }
        public string EndUserName { get; set; }
        public DateTime? Expires { get; set; }
        public List<QuoteDetails> Quotes { get; set; }

    }
   
    public enum SortField
    {
        VendorBidNumber,
        VendorName,
        EndUserName,
        ExpirationDate
    }
}
