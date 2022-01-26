//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class TdQuoteIdDetails
    {
        public string Id { get; set; }
        public string SalesOrg { get; set; }
        public string System { get; set; }
        public string Status { get; set; }
        public string Total { get; set; }
    }
}
