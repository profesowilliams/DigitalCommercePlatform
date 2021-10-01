//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal
{
    public class SpecificationModel
    {
        public string Name { get; set; }

        public bool IsIdentical
        {
            get
            {
                if (Values == null || !Values.Any())
                    return false;

                return Values.All(v => v.Equals(Values.First()));
            }
        }

        public IEnumerable<string> Values { get; set; }
    }
}