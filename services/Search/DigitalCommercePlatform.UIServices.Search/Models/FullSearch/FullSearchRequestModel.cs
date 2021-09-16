//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch
{
    [ExcludeFromCodeCoverage]
    public class FullSearchSearchRequestModel
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public string SearchString { get; set; }
        public List<RefinementGroupRequestModel> RefinementGroups { get; set; }
        public List<RangeFilterModel> RangeFilters { get; set; }
        public SortRequestModel Sort { get; set; }
        public string[] Territories { get; set; }
        public string[] Countries { get; set; }
    }
}
