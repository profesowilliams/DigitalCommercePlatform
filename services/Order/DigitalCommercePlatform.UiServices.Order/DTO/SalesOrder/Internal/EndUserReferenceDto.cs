using DigitalCommercePlatform.UIServices.Order.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder.Internal
{
    public class EndUserReferenceDto
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public ReferenceType Type { get; set; }

        public string Value { get; set; }
    }
}