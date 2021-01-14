using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Product.Dto.Product.Internal
{
    public class AttributeGroupDto
    {
        public List<AttributeDto> Attributes { get; set; }
    }

    public class AttributeDto
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
}