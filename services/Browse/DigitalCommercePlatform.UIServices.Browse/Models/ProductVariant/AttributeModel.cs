//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductVariant
{
    public class AttributeModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Rank { get; set; }
        public string Type { get; set; }
        public IEnumerable<AttributeValueModel> Values { get; set; }
    }
}
