//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class RefinementGroupResponseModel
    {
        public string Group { get; set; }
        public List<RefinementModel> Refinements { get; set; }
    }
}
