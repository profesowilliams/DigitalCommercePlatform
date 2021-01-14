using DigitalCommercePlatform.UIServices.Order.Enums;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.DTO.Invoice.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoicePartyDto
    {
        public InvoicePartyType Type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public InvoiceContactDto Contact { get; set; }
        public InvoiceAddressDto Address { get; set; }
    }
}