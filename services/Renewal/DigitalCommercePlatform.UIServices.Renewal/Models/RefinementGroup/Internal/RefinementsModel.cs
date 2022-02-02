//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup.Internal
{
    [ExcludeFromCodeCoverage]
    public class RefinementsModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string SearchKey { get; set; }
        public List<OptionsModel> Options { get; set; }

    }
}
