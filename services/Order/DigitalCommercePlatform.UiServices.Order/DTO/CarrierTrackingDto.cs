using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.DTO
{
    [ExcludeFromCodeCoverage]
    public class CarrierTrackingDto
    {
        public string Carrier { get; set; }
        public string TrackingNumber { get; set; }
        public string TrackingUrl { get; set; }
        public string ServiceLevel { get; set; }
    }
}
