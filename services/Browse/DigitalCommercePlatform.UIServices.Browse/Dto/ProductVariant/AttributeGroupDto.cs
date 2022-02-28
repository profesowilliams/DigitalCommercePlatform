//2022 (c) Tech Data Corporation - All Rights Reserved.
//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.ProductVariant
{
    public class AttributeGroupDto
    {
        public string Group { get; set; }
        public IEnumerable<AttributeDto> Attributes { get; set; }
    }
}
