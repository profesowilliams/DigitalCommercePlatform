//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch
{
    [ExcludeFromCodeCoverage]
    public class FullSearchResponseModel
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; }
        public long TotalPages { get; set; }
        public long TotalResults { get; set; }
        public SearchReportModel SearchReport { get; set; }
        public List<ElasticItemModel> Products { get; set; }
        public List<RefinementModel> TopRefinements { get; set; }
        public CategoryBreadcrumbModel CategoryBreadcrumb { get; set; }
        public bool HasMoreRefinements { get; set; }
        public IEnumerable<string> Territories { get; set; }
        public IEnumerable<DropdownElementModel<string>> SortingOptions { get; set; }
        public IEnumerable<DropdownElementModel<int>> ItemsPerPageOptions { get; set; }
        public bool IsLoggedIn { get; set; }
    }
}