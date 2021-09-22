//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Search.Dto.Content.Internal
{
    public class SearchResultDto
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
