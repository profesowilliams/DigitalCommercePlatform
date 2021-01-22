using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Models.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class MarketingModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Format { get; set; }
    }
}