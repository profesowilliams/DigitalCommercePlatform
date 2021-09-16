//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch
{
    [ExcludeFromCodeCoverage]
    public class AppSearchResponseDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; }
        public long TotalPages { get; set; }
        public long TotalResults { get; set; }
        public string Language { get; set; }
        public string Culture { get; set; }
        public SearchReportDto SearchReport { get; set; }
        public List<ElasticItemDto> Products { get; set; }
        public List<RefinementGroupResponseDto> RefinementGroups { get; set; }
        public CategoryBreadcrumbDto CategoryBreadcrumb { get; set; }
    }
}
