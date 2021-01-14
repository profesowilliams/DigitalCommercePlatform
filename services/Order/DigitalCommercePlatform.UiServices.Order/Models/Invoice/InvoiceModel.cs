using DigitalCommercePlatform.UIServices.Order.Models.Invoice.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.Invoice
{
    [ExcludeFromCodeCoverage]
    public class InvoiceModel
    {
        public string Id { get; set; }
        public DateTime? Created { get; set; }
        public IList<InvoicePartyModel> Parties { get; set; }
        public IList<InvoiceOrderModel> Orders { get; set; }
        public IList<InvoiceQuoteModel> Quotes { get; set; }
    }
}