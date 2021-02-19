namespace DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetSingleOrder
{
    public class SingleOrderResponse
    {
        public AddressDto ShipTo { get; set; }
        public PaymentDetailsDto PaymentDetails { get; set; }
        public string Customer { get; set; }
    }
}
