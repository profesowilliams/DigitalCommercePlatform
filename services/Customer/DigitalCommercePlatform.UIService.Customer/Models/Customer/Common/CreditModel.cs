namespace DigitalCommercePlatform.UIService.Customer.Models.AppServices.Customer.Common
{
    public class CreditModel
    {
        public decimal CredtLimit { get; set; }
        public decimal CreditAvailable { get; set; }
        public decimal CreditConsumed { get; set; }
        public string CreditHoldIndicator { get; set; }
        public string CreditController { get; set; }
        public string PaymentTerms { get; set; }
    }
}