//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductModel
    {
        public AuthorizationModel Authorization { get; set; }
        public string DisplayName { get; set; }
        public string Id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<MainSpecificationModel> MainSpecifications { get; set; }

        public string ManufacturerPartNumber { get; set; }
        public PriceModel Pricing { get; set; }
        public string Quantity { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ServicePriority { get; set; }

        public string ThumbnailImage { get; set; }
    }
}