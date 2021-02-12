namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    public class AddToBasketOutputDto
    {
        public string BasketName { get; set; }
        public int ItemCount { get; set; }
        public string ProductType { get; set; }
        public bool IsProductAvailableToAdd { get; set; }
        public string BasketLineIds { get; set; }
        public string MessageType { get; set; }
        public string Message { get; set; }
    }
}