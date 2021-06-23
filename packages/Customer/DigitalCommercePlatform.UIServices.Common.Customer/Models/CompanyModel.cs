using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Customer.Models
{
    [ExcludeFromCodeCoverage]
    public class CompanyModel
    {
        public string CompanyCode { get; set; }
        public string PaymentTermsCode { get; set; }
        public string PaymentTermsText { get; set; }
    }
}
