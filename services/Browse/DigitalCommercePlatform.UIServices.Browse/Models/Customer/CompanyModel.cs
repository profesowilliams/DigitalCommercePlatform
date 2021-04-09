using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Model.Customer
{
    [ExcludeFromCodeCoverage]
    public class CompanyModel
    {
        public string CompanyCode { get; set; }
        public string PaymentTermsCode { get; set; }
        public string PaymentTermsText { get; set; }
    }
}