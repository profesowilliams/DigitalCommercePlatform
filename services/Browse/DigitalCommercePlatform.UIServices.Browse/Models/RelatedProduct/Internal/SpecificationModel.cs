//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal
{
    public class SpecificationModel
    {
        public string Name { get; set; }

        public bool IsIdentical
        {
            get
            {
                if (Values == null || !Values.Any()) { return false; }

                var firstValue = Values.First().Value; 
                return Values.Select(v => v.Value).All(v => v.Equals(firstValue));
            }
        }

        public IEnumerable<SpecificationItemModel> Values { get; set; }
    }
}