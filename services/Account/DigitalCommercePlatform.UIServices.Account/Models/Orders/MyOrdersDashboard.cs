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


    public class OrderData
    {
        public long Amount { get; set; }
        public string FormattedAmount { get; set; }
        public string Percentage { get; set; }
    }
}
