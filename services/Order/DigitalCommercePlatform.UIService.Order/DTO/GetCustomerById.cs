using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Dto
{
    [ExcludeFromCodeCoverage]
    public class GetCustomerById
    {
        public string OrderId { get; set; }
        public string Customer { get; set; }
        public double Price { get; set; }
        public string PoNumber { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public string ConfirmationStatus { get; set; }
        public string DeliveryStatus { get; set; }
    }
}
