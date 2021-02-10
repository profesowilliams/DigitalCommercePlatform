namespace DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrderLines
{
    public class OrderLineResponse
    {
        public string Id { get; set; }
        public string Parent { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? TotalPrice { get; set; }
        public string Currency { get; set; }
    }
}
