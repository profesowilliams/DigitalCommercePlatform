//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal
{
    [ExcludeFromCodeCoverage]
    public class RenewalInRuleModel
    {
        public decimal? Total { get; set; }
        public string Currency { get; set; }
        public decimal? Save { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
