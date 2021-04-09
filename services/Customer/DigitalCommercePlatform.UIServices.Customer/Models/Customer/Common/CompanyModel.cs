using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Customer.Models.Customer.Common
{
    [ExcludeFromCodeCoverage]
    public class CompanyModel
    {
        public string CompanyCode { get; set; }
        public string PaymentTermsCode { get; set; }
        public string PaymentTermsText { get; set; }
    }
}