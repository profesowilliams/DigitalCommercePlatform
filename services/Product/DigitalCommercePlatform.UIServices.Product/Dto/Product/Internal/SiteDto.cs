using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class SiteDto
    {
        public string Site { get; set; }
        public SiteIndicatorDto Indicators { get; set; }
    }
}