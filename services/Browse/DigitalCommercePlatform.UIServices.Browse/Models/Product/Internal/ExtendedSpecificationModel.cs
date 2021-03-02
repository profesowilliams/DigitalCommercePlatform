using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Models.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ExtendedSpecificationModel
    {
        public string GroupName { get; set; }
        public IEnumerable<AttributeModel> Attributes { get; set; }

        public class AttributeModel
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public string Value { get; set; }
        }
    }
}