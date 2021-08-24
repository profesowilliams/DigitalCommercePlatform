//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Deals
{
    [ExcludeFromCodeCoverage]
    public class Deal
    {
        public string DealId { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }
        public string EndUserName { get; set; }
        public string CreatedOn { get; set; }
        public string ExpiresOn { get; set; }
        public string Action { get; set; } = "Create Quote";
        public string ActionUrl { get; set; }
        public List<QuoteDetails> Quotes { get; set; }
    }
}
