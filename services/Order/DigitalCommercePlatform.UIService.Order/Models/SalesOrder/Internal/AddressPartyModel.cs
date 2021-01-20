using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class AddressPartyModel : ContactPartyModel
    {
        public AddressModel Address { get; set; }
    }
}
