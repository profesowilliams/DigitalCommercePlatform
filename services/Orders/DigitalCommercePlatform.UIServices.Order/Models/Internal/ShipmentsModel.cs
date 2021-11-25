//2021 (c) Tech Data Corporation - All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class ShipmentsModel
    {
        public string Carrier { get; set; }
        public string TrackingNumber { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string TrackingLink { get; set; }
    }
}
