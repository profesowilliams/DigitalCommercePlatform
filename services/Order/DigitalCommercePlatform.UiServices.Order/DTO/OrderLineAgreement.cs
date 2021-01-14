using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.DTO
{
    [ExcludeFromCodeCoverage]
    public class OrderLineAgreement
    {
        public string Part { get; set; }
        public string TDUANumber { get; set; }
        public string SelectionIndicator { get; set; }
        public string VendorAgreementNumber { get; set; }
    }
}
