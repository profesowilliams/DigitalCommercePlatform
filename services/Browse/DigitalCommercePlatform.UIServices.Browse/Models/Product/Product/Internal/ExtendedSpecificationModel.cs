//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ExtendedSpecificationModel
    {
        public string Group { get; set; }
        public IEnumerable<SpecificationModel> GroupSpecifications { get; set; }
    }
}