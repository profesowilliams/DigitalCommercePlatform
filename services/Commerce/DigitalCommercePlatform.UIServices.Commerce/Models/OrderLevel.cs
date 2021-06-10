using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models
{
    [ExcludeFromCodeCoverage]
    public class OrderLevel
    {
        public string Id { get; set; }
        public string Value { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class OrderType
    {
        public string Id { get; set; }
        public string Value { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class OrderPricingCondtionMapping
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string TypeId { get; set; }
        public string Level { get; set; }
        public string LevelId { get; set; }
        public string SalesOrganization { get; set; }
        public string Site { get; set; }
        public string Description { get; set; }
    }
}
