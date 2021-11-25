//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Order.Enum;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DigitalCommercePlatform.UIServices.Order.Models.Order.Internal
{
    [ExcludeFromCodeCoverage]
    public class EndUserReferenceModel
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public ReferenceType Type { get; set; }

        public string Value { get; set; }
    }
}
