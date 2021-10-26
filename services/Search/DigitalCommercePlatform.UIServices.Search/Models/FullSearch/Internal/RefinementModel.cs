//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class RefinementModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string OriginalGroupName { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public RefinementType Type { get; set; } = RefinementType.MultiSelect;

        public RangeModel Range { get; set; }
        public List<RefinementOptionModel> Options { get; set; }
    }
}