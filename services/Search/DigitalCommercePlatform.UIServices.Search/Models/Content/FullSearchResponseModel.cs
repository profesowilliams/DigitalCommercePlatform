//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.Content.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.Content
{
    [ExcludeFromCodeCoverage]
    public class FullSearchResponseModel
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; }
        public long TotalPages { get; set; }
        public long TotalResults { get; set; }
        public List<SearchResult> SearchResults { get; set; }
        public List<RefinementModel> Refinements { get; set; }
    }
    public class SearchResult
    {
        public string Type { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string Site { get; set; }
        public string Url { get; set; }
        public DateTime LastUpdated { get; set; }
        public List<string> Keywords { get; set; }
    }
}
