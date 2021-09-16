//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class AlternateSearchSuggestionDto
    {
        public string SearchString { get; set; }
        public long? Results { get; set; }
        public bool CurrentSearch { get; set; }
    }
}
