using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.Invoice
{
    [ExcludeFromCodeCoverage]
    public class InvoiceResponseDto
    {
        public IList<InvoiceDto> Invoice { get; set; }
    }
}