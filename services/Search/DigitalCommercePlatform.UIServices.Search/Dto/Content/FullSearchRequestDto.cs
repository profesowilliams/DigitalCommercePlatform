//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Dto.Content.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Search.Dto.Content
{
    public class FullSearchRequestDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public string SearchString { get; set; }
        public List<RefinementRequestDto> Refinements { get; set; }
    }
}