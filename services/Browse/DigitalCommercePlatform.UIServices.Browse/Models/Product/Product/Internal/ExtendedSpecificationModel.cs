//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ExtendedSpecificationModel
    {
        [JsonProperty("group")]
        public string GroupName { get; set; }
        [JsonProperty("groupSpecifications")]
        public IEnumerable<SpecificationModel> Specifications { get; set; }
    }
}
