using DigitalCommercePlatform.UIService.Order.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class EndUserReferenceDto
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public ReferenceType Type { get; set; }

        public string Value { get; set; }
    }
}