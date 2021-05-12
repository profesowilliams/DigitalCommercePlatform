namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    public class PaymentDetails
    {
        public string NetValue { get; set; }
        public string Reference { get; set; }
        public string Currency { get; set; }
        public string CurrencySymbol { get; set; } = "$";
    }
}
