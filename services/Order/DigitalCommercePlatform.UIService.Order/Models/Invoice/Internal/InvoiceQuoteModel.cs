using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.Invoice.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoiceQuoteModel
    {
        public string Id { get; set; }
        public string Revision { get; set; }
        public string Subrevision { get; set; }
    }
}