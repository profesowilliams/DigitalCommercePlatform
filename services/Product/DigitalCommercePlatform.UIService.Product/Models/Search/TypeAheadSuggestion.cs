namespace DigitalCommercePlatform.UIService.Product.Models.Search
{
    //public class TypeAheadSuggestion
    //{
    //    //API will have config setting with base URL. It needs to
    //    //return a full URL because the response may be rendered on
    //    //shop or on another site (corporate)
    //    public string Url { get; set; }
    //    public string Keyword { get; set; }
    //    public TypeAheadSuggestionRefinement[] Refinements { get; set; }
    //    public TypeAheadSuggestionTypes SuggestionType { get; set; }
    //}

    public class TypeAheadSuggestion
    {
        public string Keyword { get; set; }
        public TypeAheadSuggestionRefinementV2[] Refinements { get; set; }
        public TypeAheadSuggestionTypes SuggestionType { get; set; }
    }
}