using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class OrderLinkModel
    {
        public String ID { get; set; }
        public String AltID { get; set; }
        public String Line { get; set; }
    }
}