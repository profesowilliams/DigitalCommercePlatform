namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    public class ResponseCartProductListItem
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public uint Quantity { get; set; }
        public int LineNumber { get; set; }
    }
}