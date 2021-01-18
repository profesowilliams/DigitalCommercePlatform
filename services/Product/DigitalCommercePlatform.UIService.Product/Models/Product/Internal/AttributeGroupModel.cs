using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Product.Models.Product.Internal
{
    public class AttributeGroupModel
    {
        public List<AttributeModel> Attributes { get; set; }
    }

    public class AttributeModel
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
}