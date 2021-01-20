using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.Invoice.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoiceContactDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}