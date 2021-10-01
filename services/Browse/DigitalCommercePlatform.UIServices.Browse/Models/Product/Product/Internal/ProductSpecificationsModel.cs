//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductSpecificationsModel
    {
        public IEnumerable<MainSpecificationModel> MainSpecifications { get; set; }
        public IEnumerable<ExtendedSpecificationModel> ExtendedSpecifications { get; set; }
    }
}