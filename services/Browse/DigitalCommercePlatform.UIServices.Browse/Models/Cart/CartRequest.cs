//2021 (c) Tech Data Corporation -. All Rights Reserved.
namespace DigitalCommercePlatform.UIServices.Browse.Models.Cart
{
    public class CartRequest
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int TenantId { get; set; }
        public string UserId { get; set; }
        public string CultureName { get; set; }
    }
}
