using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class AddressPartyDto : ContactPartyDto
    {
        public AddressDto Address { get; set; }
    }
}