namespace DigitalCommercePlatform.UIService.Product.Models.Search
{
    public class TypeAheadSuggestionRefinement
    {
        public string Description { get; set; }
        public TypeAheadSuggestionRefinementTypes RefinementType { get; set; }
    }

    public class TypeAheadSuggestionRefinementV2
    {
        public string Description { get; set; }
        public string RefinementId { get; set; }
        public TypeAheadSuggestionRefinementTypes RefinementType { get; set; }
    }
}