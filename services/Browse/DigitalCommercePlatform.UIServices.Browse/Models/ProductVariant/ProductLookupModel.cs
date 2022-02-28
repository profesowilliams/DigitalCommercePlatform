//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductVariant
{
    public class ProductLookupModel
    {
        public string Key { get; set; }
        public IEnumerable<string> Value { get; set; }
    }
}