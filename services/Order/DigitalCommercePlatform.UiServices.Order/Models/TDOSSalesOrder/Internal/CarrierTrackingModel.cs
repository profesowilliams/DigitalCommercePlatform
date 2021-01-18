namespace DigitalCommercePlatform.UIServices.Order.Models.TDOSSalesOrder.Internal
{
    public class CarrierTrackingModel
    {
        public string Carrier { get; set; }
        public string TrackingNumber { get; set; }
        public System.Uri TrackingUrl { get; set; }
        public string ServiceLevel { get; set; }
    }
}