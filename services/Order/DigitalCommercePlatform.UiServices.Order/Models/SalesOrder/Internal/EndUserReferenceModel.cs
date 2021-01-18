using DigitalCommercePlatform.UIServices.Order.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DigitalCommercePlatform.UIServices.Order.Models.SalesOrder.Internal
{
    public class EndUserReferenceModel
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public ReferenceType Type { get; set; }

        public string Value { get; set; }
    }
}