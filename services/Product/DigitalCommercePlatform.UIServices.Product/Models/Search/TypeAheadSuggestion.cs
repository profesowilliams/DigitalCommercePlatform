using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class TypeAheadSuggestion
    {
        public string Keyword { get; set; }
        public TypeAheadSuggestionRefinementV2[] Refinements { get; set; }
        public TypeAheadSuggestionTypes SuggestionType { get; set; }
    }
}