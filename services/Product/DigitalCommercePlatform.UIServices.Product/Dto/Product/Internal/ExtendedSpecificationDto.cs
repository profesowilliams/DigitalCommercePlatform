using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ExtendedSpecificationDto
    {
        public string GroupName { get; set; }
        public IEnumerable<AttributeDto> Attributes { get; set; }

        public class AttributeDto
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public string Value { get; set; }
        }
    }
}