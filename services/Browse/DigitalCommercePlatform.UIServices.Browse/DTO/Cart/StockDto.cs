namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    public class StockDto
    {
        public string DisplayName { get; set; }
        public int? IntouchSum { get; set; }
        public int Quantity { get; set; }
        public string QuantityFormatted { get; set; }
        public string StockAvailabilityValue { get; set; }
        public string Type { get; set; }
    }
}