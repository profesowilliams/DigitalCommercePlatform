//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Deals
{
    [ExcludeFromCodeCoverage]
    public class DealsdetailsForProducts
    {
        public string Bid { get; set; }
        public decimal Version { get; set; }
        public string DealId { get; set; }
        public string EndUserName { get; set; }
        public string Vendor { get; set; }
        public string ExpiryDate { get; set; }
        public IList<SpaDetailProductModel> Products { get; set; }
    }
}
