using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContactPartyDto : BasePartyDto
    {
        public ContactDto Contact { get; set; }
    }
}