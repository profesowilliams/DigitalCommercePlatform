namespace DigitalCommercePlatform.UIService.Browse.DTO.Product.Stock.Internal
{
    public class LocationDto
    {
        /// <summary>
        /// Location
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// Available to promise
        /// </summary>
        public int? AvailableToPromise { get; set; }

        /// <summary>
        /// Stock
        /// </summary>
        public int? Stock { get; set; }

        /// <summary>
        /// Ordered
        /// </summary>
        public int? Ordered { get; set; }

        /// <summary>
        /// Delivery time
        /// </summary>
        public int? DeliveryTime { get; set; }
    }
}