//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class SiteDto
    {
        public string Site { get; set; }
        public SiteIndicatorDto Indicators { get; set; }
    }
}
