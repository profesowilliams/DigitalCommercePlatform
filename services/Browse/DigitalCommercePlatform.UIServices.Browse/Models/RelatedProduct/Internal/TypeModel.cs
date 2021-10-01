//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal
{
    [ExcludeFromCodeCoverage]

    public class TypeModel
    {
        public string Type { get; set; }
        public List<CategoryModel> Categories { get; set; }
    }
}
