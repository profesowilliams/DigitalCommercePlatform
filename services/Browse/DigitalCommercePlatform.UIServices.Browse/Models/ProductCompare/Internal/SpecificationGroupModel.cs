//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal
{
    public class SpecificationGroupModel
    {
        public string Group { get; set; }
        public IEnumerable<SpecificationModel> Specifications { get; set; }
    }
}