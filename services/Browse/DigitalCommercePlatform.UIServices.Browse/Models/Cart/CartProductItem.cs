//2021 (c) Tech Data Corporation -. All Rights Reserved.
namespace DigitalCommercePlatform.UIServices.Browse.Models.Cart
{
    public class CartProductItem
    {
        public long Id { get; set; }
        public string ProductId { get; set; }
        public ushort Quantity { get; set; }
        public string AgreementNumber { get; set; }
        public int LineNumber { get; set; }
    }
}

