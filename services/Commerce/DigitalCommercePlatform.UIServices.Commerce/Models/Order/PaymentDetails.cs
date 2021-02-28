using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order
{
    public class PaymentDetails
    {
        public string NetValue { get; set; }
        public string Reference { get; set; }
        public string Currency { get; set; }
    }
}
