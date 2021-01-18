using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO
{
    [ExcludeFromCodeCoverage]
    public class InvoiceDto
    {
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
    }
}
