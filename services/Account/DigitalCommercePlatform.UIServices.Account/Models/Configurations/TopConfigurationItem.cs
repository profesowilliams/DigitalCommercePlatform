//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Configurations
{
    [ExcludeFromCodeCoverage]

    public class TopConfigurationItem
    {
        public Source Source { get; set; }
        public decimal TotalListPrice { get; set; }
        public Reseller Reseller { get; set; }
        public EndUser EndUser { get; set; }
    }
}
