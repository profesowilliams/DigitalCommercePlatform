namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    public class BasketDto
    {
        public int BasketId { get; set; }
        public string BasketName { get; set; }
        public double TotalPrice { get; set; }
        public double TotalDiscount { get; set; }
        public string DeliveryAddressType { get; set; }
        public int DeliveryAddressId { get; set; }
        public string BasketDeliveryType { get; set; }
        public string BasketDeliveryTypeLabel { get; set; }

        public string BasketDeliveryOptionLabel { get; set; }
        public string YourOrderReferenceNumer { get; set; }
        public bool IsBadBoxBasket { get; set; }
        public bool IsPta { get; set; }
        public string AgreementEmailRecipients { get; set; }
        public string OriginalAccountNumber { get; set; }
    }
}