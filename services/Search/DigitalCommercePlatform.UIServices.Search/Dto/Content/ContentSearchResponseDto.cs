//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Dto.Content.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Search.Dto.Content
{
    public class ContentSearchResponseDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; }
        public long TotalPages { get; set; }
        public long TotalResults { get; set; }
        public List<SearchResultDto> SearchResults { get; set; }
        public List<RefinementDto> Refinements { get; set; }
    }
}
