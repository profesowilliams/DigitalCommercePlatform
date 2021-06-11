using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.TypeAhead.Models
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