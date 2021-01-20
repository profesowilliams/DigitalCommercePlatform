using DigitalCommercePlatform.UIService.Order.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
    public class ProductDto
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public ProductType Type { get; set; }

        public string ID { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string LocalManufacturer { get; set; }
    }
}