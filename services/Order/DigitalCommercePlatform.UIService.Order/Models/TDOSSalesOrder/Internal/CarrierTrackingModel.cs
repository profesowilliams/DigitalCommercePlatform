using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.TDOSSalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class CarrierTrackingModel
    {
        public string Carrier { get; set; }
        public string TrackingNumber { get; set; }
        public System.Uri TrackingUrl { get; set; }
        public string ServiceLevel { get; set; }
    }
}