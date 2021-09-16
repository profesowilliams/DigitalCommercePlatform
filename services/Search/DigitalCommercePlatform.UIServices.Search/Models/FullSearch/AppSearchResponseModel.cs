//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch
{
    [ExcludeFromCodeCoverage]
    public class ProductSearchResponseModel
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; }
        public long TotalPages { get; set; }
        public long TotalResults { get; set; }
        public string Language { get; set; }
        public string Culture { get; set; }
        public SearchReportModel SearchReport { get; set; }
        public List<ElasticItemModel> Products { get; set; }
        public List<RefinementGroupResponseModel> RefinementGroups { get; set; }
        public CategoryBreadcrumbModel CategoryBreadcrumb { get; set; }
    }
}
