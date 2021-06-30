using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Deals.Internal
{
    [ExcludeFromCodeCoverage]
    public class AppServiceDeal
    {
        public string DealId { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }
        public string EndUserName { get; set; }
        public string TdQuoteId { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ExpiresOn { get; set; }
        public string Action { get; set; }
        public string ActionUrl { get; set; }
    }
}
