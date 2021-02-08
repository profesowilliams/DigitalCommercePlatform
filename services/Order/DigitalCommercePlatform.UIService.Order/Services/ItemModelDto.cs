namespace DigitalCommercePlatform.UIService.Order.Services
{
    public class ItemModelDto
    {
        public string ID { get; set; }
        public string Parent { get; set; }
        public int Quantity { get; set; }
        public decimal? TotalPrice { get; set; }
        public decimal? UnitPrice { get; set; }
        public string Currency { get; set; }
    }
}
