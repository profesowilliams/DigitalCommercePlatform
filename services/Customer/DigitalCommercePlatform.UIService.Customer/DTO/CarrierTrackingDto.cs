using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Customer.DTO
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
