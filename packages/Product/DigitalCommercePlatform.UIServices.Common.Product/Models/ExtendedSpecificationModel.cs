using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Common.Product.Models
{
    public class ExtendedSpecificationModel
    {
        public string GroupName { get; set; }
        public IEnumerable<AttributeModel> Attributes { get; set; }
    }
}
