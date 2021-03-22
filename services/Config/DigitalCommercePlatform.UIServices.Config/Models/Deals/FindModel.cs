using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Deals
{
    [ExcludeFromCodeCoverage]
    public class FindModel
    {
        public string CustomerId { get; set; } // get this from cache using session id 
        public string UserId { get; set; } // get this from cache using session id 
        public string AuthToken { get; set; } // get this from cache using session id 
        public string SortBy { get; set; }        
        public string SortDirection { get; set; }
        public string DealId { get; set; }
        public string Vendor { get; set; }
        public string Market { get; set; }
    }
}
