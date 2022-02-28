//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductVariant
{
    public class ProductVariantModel
    {
        public string Name { get; set; }
        public IEnumerable<ProductLookupModel> ProductLookup { get; set; }

        public IEnumerable<AttributeGroupModel> AttributeGroups { get; set; }
    }
}
