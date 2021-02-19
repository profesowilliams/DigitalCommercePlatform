namespace DigitalCommercePlatform.UIServices.Product.Models.Search
{
    public class TypeAheadResponse 
    {
        public TypeAheadRequest Request { get; set; }
        public TypeAheadSuggestion[] Suggestions { get; set; }
    }
}