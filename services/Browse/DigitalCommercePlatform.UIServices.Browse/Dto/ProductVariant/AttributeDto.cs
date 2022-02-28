//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.ProductVariant
{
    public class AttributeDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Rank { get; set; }
        public string Type { get; set; }
        public IEnumerable<AttributeValueDto> Values { get; set; }
    }
}
