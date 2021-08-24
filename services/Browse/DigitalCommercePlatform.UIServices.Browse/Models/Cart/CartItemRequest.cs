//2021 (c) Tech Data Corporation -. All Rights Reserved.
namespace DigitalCommercePlatform.UIServices.Browse.Models.Cart
{
    public class CartItemRequest
    {
        public long Id { get; set; }
        public long? ParentId { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string CultureName { get; set; }
        public string UserId { get; set; }
        public long CartId { get; set; }
        public int TenantId { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string ShortDescription { get; set; }
        public string ItemCategoryGroup { get; set; }
        public string CurrencyCode { get; set; }
        public string AgreementNumber { get; set; }
    }
}
