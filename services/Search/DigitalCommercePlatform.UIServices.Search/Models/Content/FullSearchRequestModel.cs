//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.Content.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.Content
{
    [ExcludeFromCodeCoverage]
    public class FullSearchRequestModel
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public string Keyword { get; set; }
        public List<RefinementRequestModel> Refinements { get; set; }
    }
}
