//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch
{
    [ExcludeFromCodeCoverage]
    public class FullSearchRequestModel
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public string SearchString { get; set; }
        public string OrderLevel { get; set; } = "Commercial";
        public List<RefinementGroupRequestModel> RefinementGroups { get; set; }
        public SortRequestModel Sort { get; set; }
        public string[] Territories { get; set; }
        public string[] Countries { get; set; }
        public bool GetRefinements { get; set; }
    }
}