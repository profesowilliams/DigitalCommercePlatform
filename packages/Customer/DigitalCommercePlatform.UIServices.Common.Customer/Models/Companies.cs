using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Customer.Models
{
    [ExcludeFromCodeCoverage]
    public class Companies
    {
        public string companyCode { get; set; }
        public string paymentTermsCode { get; set; }
        public string paymentTermsText { get; set; }
    }
}
