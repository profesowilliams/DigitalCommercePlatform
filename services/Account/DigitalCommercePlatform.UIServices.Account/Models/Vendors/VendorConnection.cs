//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Vendors
{
    [ExcludeFromCodeCoverage]
    public class VendorConnection
    {
        public string Vendor { get; set; }
        public bool IsConnected { get; set; }
        public DateTime ConnectionDate { get; set; }
        public bool IsValidRefreshToken { get; set; }
    }
}
