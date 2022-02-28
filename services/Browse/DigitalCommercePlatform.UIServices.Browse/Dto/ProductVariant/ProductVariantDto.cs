//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.ProductVariant
{
    public class ProductVariantDto
    {
        public string Id { get; set; }
        public IEnumerable<AttributeGroupDto> AttributeGroups { get; set; }
    }
}
