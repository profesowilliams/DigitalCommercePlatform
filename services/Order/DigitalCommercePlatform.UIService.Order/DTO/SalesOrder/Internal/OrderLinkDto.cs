using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class OrderLinkDto
    {
        public String ID { get; set; }
        public String AltID { get; set; }
        public String Line { get; set; }
    }
}