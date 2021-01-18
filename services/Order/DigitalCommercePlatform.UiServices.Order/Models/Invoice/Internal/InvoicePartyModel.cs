using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.Invoice.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoicePartyModel
    {
        public string Type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public InvoiceContactModel Contact { get; set; }
        public InvoiceAddressModel Address { get; set; }
    }
}