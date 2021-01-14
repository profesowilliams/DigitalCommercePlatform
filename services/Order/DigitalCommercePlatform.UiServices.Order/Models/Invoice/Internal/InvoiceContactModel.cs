using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.Invoice.Internal
{
    [ExcludeFromCodeCoverage]
    public class InvoiceContactModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}