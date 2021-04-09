using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Customer
{
    [ExcludeFromCodeCoverage]
    public class CompanyDto
    {
        public string CompanyCode { get; set; }
        public string PaymentTermsCode { get; set; }
        public string PaymentTermsText { get; set; }
    }
}