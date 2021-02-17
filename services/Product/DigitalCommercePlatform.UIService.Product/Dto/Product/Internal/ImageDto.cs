using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ImageDto
    {
        public string Id { get; set; }

        [SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "<Pending>")]
        public string Url { get; set; }
        public string Type { get; set; }
        public string Angle { get; set; }
    }
}