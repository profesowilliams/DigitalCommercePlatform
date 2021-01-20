using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class AgreementModel
    {
        public string ID { get; set; }
        public string VendorID { get; set; }
        public string SelectionFlag { get; set; }
    }
}