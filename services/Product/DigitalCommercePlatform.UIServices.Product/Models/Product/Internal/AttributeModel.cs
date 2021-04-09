using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Models.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class AttributeModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string Unit { get; set; }
    }
}