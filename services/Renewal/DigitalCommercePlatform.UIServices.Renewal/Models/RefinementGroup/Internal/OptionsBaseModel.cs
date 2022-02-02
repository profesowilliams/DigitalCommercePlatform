//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Newtonsoft.Json;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup.Internal
{
    [ExcludeFromCodeCoverage]
    public class OptionsBaseModel
    {
        [JsonProperty(Order = 1)]
        public string Id { get; set; }
        [JsonProperty(Order = 2)]
        public string Text { get; set; }
        [JsonProperty(Order = 3, NullValueHandling = NullValueHandling.Ignore)]
        public string SearchKey { get; set; }
        [JsonProperty(Order = 4)]
        public string Selected { get; set; }
    }
}
