using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Customer.Models.Dtos
{
    [ExcludeFromCodeCoverage]
    public class CustomerLineAgreement
    {
        public string Part { get; set; }
        public string TDUANumber { get; set; }
        public string SelectionIndicator { get; set; }
        public string VendorAgreementNumber { get; set; }
    }
}
