using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Dto.Internal
{
    [ExcludeFromCodeCoverage]
    public class ShipmentsDto
    {
        public string Carrier { get; set; }
        public string TrackingNumber { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string TrackingLink { get; set; }
    }
}
