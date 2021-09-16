//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.App.Internal
{
    [ExcludeFromCodeCoverage]
    public class RefinementGroupRequestModel
    {
        public string Group { get; set; }
        public List<RefinementRequestModel> Refinements { get; set; }
    }
}
