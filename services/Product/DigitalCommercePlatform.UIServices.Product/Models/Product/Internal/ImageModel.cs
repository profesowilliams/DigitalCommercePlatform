using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Models.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ImageModel
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string Type { get; set; }
        public string Angle { get; set; }
    }
}