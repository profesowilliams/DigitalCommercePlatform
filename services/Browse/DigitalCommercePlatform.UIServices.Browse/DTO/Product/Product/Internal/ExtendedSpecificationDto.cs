using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ExtendedSpecificationDto
    {
        public string GroupName { get; set; }
        public IEnumerable<AttributeDto> Attributes { get; set; }

        [SuppressMessage("Design", "CA1034:Nested types should not be visible", Justification = "<Pending>")]
        public class AttributeDto
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public string Value { get; set; }
        }
    }
}