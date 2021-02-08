using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class AgreementDto
    {
        public string ID { get; set; }
        public string VendorID { get; set; }
        public string SelectionFlag { get; set; }
    }
}