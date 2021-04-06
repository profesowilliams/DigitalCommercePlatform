using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Orders
{
    [ExcludeFromCodeCoverage]
    public class MyOrdersDashboard
    {
        public bool IsMontly { get; set; }
        public string CurrencyCode { get; set; }
        public string ProcessedOrderPercentage { get; set; }
        public long ProcessedOrdersAmount { get; set; }
        public long TotalOrderAmount { get; set; }
        public string TotalFormattedAmount { get; set; }
        public string ProcessedFormattedAmount { get; set; }

    }
}
