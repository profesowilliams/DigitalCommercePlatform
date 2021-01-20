using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContactDto
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}