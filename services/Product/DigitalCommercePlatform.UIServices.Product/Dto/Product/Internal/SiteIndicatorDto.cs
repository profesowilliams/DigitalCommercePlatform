using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class SiteIndicatorDto
    {
        public string Searchable { get; set; }
        public string Orderable { get; set; }
        public string Returnable { get; set; }
    }
}