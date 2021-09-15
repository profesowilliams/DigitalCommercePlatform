//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class PopulateKeywordSuggestionInput
    {
        public string SearchApplication { get; set; }
        public int MaximumHistoryDays { get; set; }
        public int MinimumRank { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class PopulateKeywordRefinementSuggestionInput
    {
        public string SearchApplication { get; set; }
        public int MaximumRefinementsPerKeyword { get; set; }
    }
}
