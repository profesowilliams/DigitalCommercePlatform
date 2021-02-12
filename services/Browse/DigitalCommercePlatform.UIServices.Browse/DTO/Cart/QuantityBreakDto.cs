namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    public class QuantityBreakDto
    {
        public int Quantity { get; set; }
        public bool? SdQuantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public string PriceDisplay { get; set; }
    }
}