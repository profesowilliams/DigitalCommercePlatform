using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Customer.Models.Customer.Common
{
    [ExcludeFromCodeCoverage]
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