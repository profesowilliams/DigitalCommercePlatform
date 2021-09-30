//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class RelatedProductTypeDto
    {
        public string Id { get; set; }
        public string System { get; set; }
        public string Category { get; set; }
        public int DisplayOrder { get; set; }
        public string Subcategory { get; set; }
    }
}
