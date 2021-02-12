using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Customer
{
    [ExcludeFromCodeCoverage]
    public class CarrierAccountNumberDto
    {
        public string CustomerName { get; set; }
        public string SoldToParty { get; set; }
        public string SoldToPartyName { get; set; }
        public string ShipToNumber { get; set; }
        public string ShipToName { get; set; }
        public string ShippingCondition { get; set; }
        public string ThirdPartyFreightNumber { get; set; }
    }
}