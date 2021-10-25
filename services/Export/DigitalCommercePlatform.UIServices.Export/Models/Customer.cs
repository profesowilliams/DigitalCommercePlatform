//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models
{
    [ExcludeFromCodeCoverage]
    public class Customer
    {
        public string CustomerNumber { get; set; }
        public string CompanyName { get; set; }
        public bool PrivateLabelDelivery { get; set; }
    }
}
