//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class AlternateSearchSuggestionModel
    {
        public string SearchString { get; set; }
        public long? Results { get; set; }
        public bool CurrentSearch { get; set; }
    }
}
