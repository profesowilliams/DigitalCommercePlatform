using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DigitalCommercePlatform.UIService.Order.Enums;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductModel
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public ProductType Type { get; set; }

        public string ID { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string LocalManufacturer { get; set; }
    }
}