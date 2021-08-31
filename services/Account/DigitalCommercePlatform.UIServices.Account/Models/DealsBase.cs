//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models
{
    [ExcludeFromCodeCoverage]
    public class DealsBase
    {
        public string VendorBidNumber { get; set; }
        public string Description { get; set; }
        public string Vendor { get; set; }
        public string VendorName { get; set; }
        public string EndUser { get; set; }
        public string EndUserName { get; set; }
        public DateTime? ExpirationDate { get; set; }

    }
}
