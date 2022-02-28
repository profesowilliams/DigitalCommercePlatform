//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductVariant
{
    public class AttributeGroupModel
    {
        public string Group { get; set; }
        public IEnumerable<AttributeModel> Attributes { get; set; }
    }
}
