//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    [ExcludeFromCodeCoverage]
    public class PaymentDetails
    {
        public string NetValue { get; set; }
        public string Reference { get; set; }
        public string Currency { get; set; }
        public string CurrencySymbol { get; set; } = "$";
        public string PaymentTermText { get; set; }
        public decimal? Subtotal { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Freight { get; set; }
        public decimal? OtherFees { get; set; }
        public decimal? Total { get; set; }
    }
}
