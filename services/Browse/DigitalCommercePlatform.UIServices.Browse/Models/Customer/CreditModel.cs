using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Model.Customer
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