using DigitalCommercePlatform.UIService.Order.DTO.Invoice.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.Invoice
{
    [ExcludeFromCodeCoverage]
    public class InvoiceDto
    {
        public string Id { get; set; }
        public DateTime? Created { get; set; }
        public IList<InvoicePartyDto> Parties { get; set; }
        public IList<InvoiceOrderDto> Orders { get; set; }
        public IList<InvoiceQuoteDto> Quotes { get; set; }
    }
}