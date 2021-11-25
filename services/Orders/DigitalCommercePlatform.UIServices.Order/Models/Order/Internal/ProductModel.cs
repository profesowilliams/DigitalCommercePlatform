//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Order.Enum;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DigitalCommercePlatform.UIServices.Order.Models.Order.Internal
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
