//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class SearchReportModel
    {
        public string OrginalSearchTerm { get; set; }
        public List<AlternateSearchSuggestionModel> AlternateSearchSuggestions { get; set; }
    }
}
