using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class TypeAheadSuggestion
    {
        public TypeAheadResultType Type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public enum TypeAheadResultType
    {
        ProductSearch,
        Product,
        Page
    }
}