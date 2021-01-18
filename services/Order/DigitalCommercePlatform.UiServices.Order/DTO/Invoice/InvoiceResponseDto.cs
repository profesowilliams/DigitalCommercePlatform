using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.DTO.Invoice
{
    [ExcludeFromCodeCoverage]
    public class InvoiceResponseDto
    {
        public IList<InvoiceDto> Invoice { get; set; }
    }
}