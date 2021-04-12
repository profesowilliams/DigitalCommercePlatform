using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Deals
{
    [ExcludeFromCodeCoverage]
    public class DealModel
    {
        public int Sequence { get; internal set; }
        public string UserName { get; set; }
        public decimal DealValue { get; set; }
        public string CurrencyCode { get; set; }
        public string FormattedAmount { get; set; }
    }
}
