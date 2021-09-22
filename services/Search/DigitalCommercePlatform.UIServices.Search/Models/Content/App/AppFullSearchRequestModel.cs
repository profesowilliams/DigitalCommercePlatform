//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.Content.App.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Search.Models.Content.App
{
    public class AppFullSearchRequestModel
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public string SearchString { get; set; }
        public List<RefinementRequestModel> Refinements { get; set; }
    }
}
