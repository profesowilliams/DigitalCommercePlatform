//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare
{
    public class CompareModel
    {
        public IEnumerable<ProductModel> Products { get; set; }

        public IEnumerable<SpecificationGroupModel> SpecificationGroups { get; set; }
    }
}