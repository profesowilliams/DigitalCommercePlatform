using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Configuration.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class DiscountDto
    {
        public string Id { get; set; }
        public decimal Value { get; set; }
    }
}