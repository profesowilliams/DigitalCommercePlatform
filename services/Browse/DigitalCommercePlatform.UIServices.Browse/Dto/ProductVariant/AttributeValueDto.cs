//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.ProductVariant
{
    public class AttributeValueDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string ColorCode { get; set; }
        public string ImageUrl { get; set; }
        public IEnumerable<string> ProductIds { get; set; }
        public bool IsSelected { get; set; }
    }
}
