using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class TypeAheadSuggestionRefinement
    {
        public string Description { get; set; }
        public TypeAheadSuggestionRefinementTypes RefinementType { get; set; }
        
    }
    [ExcludeFromCodeCoverage]
    public class TypeAheadSuggestionRefinementV2
    {
        public string Description { get; set; }
        public string RefinementId { get; set; }
        public TypeAheadSuggestionRefinementTypes RefinementType { get; set; }

    }
}