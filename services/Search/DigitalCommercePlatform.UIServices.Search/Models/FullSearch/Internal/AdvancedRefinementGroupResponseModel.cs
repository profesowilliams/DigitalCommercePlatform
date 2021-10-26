//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class AdvancedRefinementGroupResponseModel
    {
        public string Group { get; set; }
        public List<AdvancedRefinementSubGroupResponseModel> Subgroups { get; set; }
    }

    public class AdvancedRefinementSubGroupResponseModel
    {
        public string Name { get; set; }
        public List<RefinementModel> Refinements { get; set; }
    }
}