using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.Invoice.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoiceQuoteDto
    {
        public string Id { get; set; }
        public string Revision { get; set; }
        public string Subrevision { get; set; }
    }
}