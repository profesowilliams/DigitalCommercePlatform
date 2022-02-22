//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal
{
    [ExcludeFromCodeCoverage]
    public class CategoryModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string CategoryId { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }
        
        public List<ProductModel> Products { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<SpecificationModel> MainSpecifications { get; set; }
    }
}