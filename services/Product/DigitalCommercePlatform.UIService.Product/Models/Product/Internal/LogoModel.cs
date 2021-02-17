using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Models.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class LogoModel
    {
        public string Id { get; set; }

        [SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "<Pending>")]
        public string Url { get; set; }
    }
}