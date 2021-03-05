using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class SiteModel
    {
        public string Site { get; set; }
        public SiteIndicatorModel Indicators { get; set; }
    }
}