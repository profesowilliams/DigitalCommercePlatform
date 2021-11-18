//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup.Internal
{
    [ExcludeFromCodeCoverage]
    public class OptionsModel : OptionsBaseModel
    {
        [JsonProperty(Order = 10)]
        public List<OptionsBaseModel> SubOptions { get; set; }
    }
}
