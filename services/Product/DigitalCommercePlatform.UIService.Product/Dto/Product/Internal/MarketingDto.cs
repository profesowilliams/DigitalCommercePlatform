using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class MarketingDto
    {
        public string Id { get; set; }
        public string Name { get; set; }

        [SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "<Pending>")]
        public string Url { get; set; }
        public string Format { get; set; }
    }
}