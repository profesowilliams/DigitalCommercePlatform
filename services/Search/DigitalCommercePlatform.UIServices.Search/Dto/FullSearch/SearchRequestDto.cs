//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Enums;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch
{
    [ExcludeFromCodeCoverage]
    public class SearchRequestDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; }
        public string SearchString { get; set; }
        public List<RefinementGroupRequestDto> RefinementGroups { get; set; }
        public List<RangeFilterDto> RangeFilters { get; set; }
        public SortRequestDto Sort { get; set; }
        public string[] Territories { get; set; }
        public Dictionary<Details, bool> GetDetails { get; set; }
        public SearchProfileId SearchProfileId { get; set; }
        public string Culture { get; set; }
        public string OrderLevel { get; set; }
    }
}