//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ExtendedSpecificationDto
    {
        public string GroupName { get; set; }
        public IEnumerable<SpecificationDto> Specifications { get; set; }
    }
}
