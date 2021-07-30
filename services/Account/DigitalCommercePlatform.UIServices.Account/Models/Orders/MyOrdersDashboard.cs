using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Orders
{
    [ExcludeFromCodeCoverage]
    public class MyOrdersDashboard
    {
        public bool IsMonthly { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrencySymbol { get; set; }

        public OrderData Total { get; set; }
        public OrderData Processed { get; set; }
        public OrderData Shipped { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class OrderData
    {
        public decimal Amount { get; set; }
        public string FormattedAmount { get; set; }
        public string Percentage { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class OrderStatsDto
    {
        public OrderStatsDataDto[] Data { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class OrderStatsDataDto
    {
        public string Value { get; set; }
        public string Count { get; set; }
        public string TotalValue { get; set; }
        public string Currency { get; set; }
    }

}
