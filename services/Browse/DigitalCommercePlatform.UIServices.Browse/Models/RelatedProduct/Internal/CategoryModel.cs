//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal
{
    public class CategoryModel
    {
        public string CategoryId { get; set; }
        public string Name { get; set; }
        public List<ProductModel> Products { get; set; }
    }
}
