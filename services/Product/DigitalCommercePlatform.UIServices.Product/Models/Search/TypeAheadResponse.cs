using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class TypeAheadResponse 
    {
        public TypeAheadRequest Request { get; set; }
        public TypeAheadSuggestion[] Suggestions { get; set; }
    }
}