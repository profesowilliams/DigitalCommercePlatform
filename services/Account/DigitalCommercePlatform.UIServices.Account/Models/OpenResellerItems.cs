//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models
{
    [ExcludeFromCodeCoverage]
    public class OpenResellerItems
    {
        public int Sequence { get; set; }
        public string EndUserName { get; set; }
        public decimal? Amount { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrencySymbol { get; set; }
        public string FormattedAmount { get; set; }
    }
}
