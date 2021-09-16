//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Enums;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch
{
    [ExcludeFromCodeCoverage]
    public class AppSearchRequestModel : FullSearchSearchRequestModel
    {
        public Dictionary<Details, bool> GetDetails { get; set; }
    }
}
