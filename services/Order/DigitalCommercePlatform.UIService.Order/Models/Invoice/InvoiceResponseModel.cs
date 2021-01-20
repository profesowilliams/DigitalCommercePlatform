using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.Invoice
{
    [ExcludeFromCodeCoverage]
    public class InvoiceResponseModel
    {
        public IList<InvoiceModel> Invoice { get; set; }
    }
}