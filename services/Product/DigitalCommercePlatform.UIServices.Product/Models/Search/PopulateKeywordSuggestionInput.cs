using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class PopulateKeywordSuggestionInput
    {
        public string SearchApplication { get; set; }
        public int MaximumHistoryDays { get; set; }
        public int MinimumRank { get; set; }
    }

    public class PopulateKeywordRefinementSuggestionInput
    {
        public string SearchApplication { get; set; }
        public int MaximumRefinementsPerKeyword { get; set; }
    }
}