using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.TDOSSalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class OrderLineAgreementModel
    {
        public string Part { get; set; }
        public string TDUANumber { get; set; }
        public string SelectionIndicator { get; set; }
        public string VendorAgreementNumber { get; set; }
    }
}