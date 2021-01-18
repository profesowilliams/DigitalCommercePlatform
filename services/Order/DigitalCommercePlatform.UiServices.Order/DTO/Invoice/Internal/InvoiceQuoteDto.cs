using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.DTO.Invoice.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoiceQuoteDto
    {
        public string Id { get; set; }
        public string Revision { get; set; }
        public string Subrevision { get; set; }
    }
}