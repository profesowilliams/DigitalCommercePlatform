//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct
{
    public class RelatedProductResponseModel
    {
        public Dictionary<string, List<TypeModel>> Product { get; set; }
        public string[] ProductsNotFound { get; set; }
    }
}
