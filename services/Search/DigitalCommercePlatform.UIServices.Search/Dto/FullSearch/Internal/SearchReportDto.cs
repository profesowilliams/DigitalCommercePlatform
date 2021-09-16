//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class SearchReportDto
    {
        public string OrginalSearchTerm { get; set; }
        public List<AlternateSearchSuggestionDto> AlternateSearchSuggestions { get; set; }
    }
}
