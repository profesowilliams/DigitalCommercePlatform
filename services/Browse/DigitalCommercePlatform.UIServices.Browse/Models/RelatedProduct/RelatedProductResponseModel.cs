//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct
{
    [ExcludeFromCodeCoverage]
    public class RelatedProductResponseModel
    {
        public Dictionary<string, List<TypeModel>> ProductTypes { get; set; }
    }
}
