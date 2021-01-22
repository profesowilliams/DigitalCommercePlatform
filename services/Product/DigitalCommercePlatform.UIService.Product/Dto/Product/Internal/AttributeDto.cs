using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class AttributeDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string Unit { get; set; }
    }
}