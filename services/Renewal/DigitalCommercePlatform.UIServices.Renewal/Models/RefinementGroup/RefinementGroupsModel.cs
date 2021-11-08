//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup
{
    [ExcludeFromCodeCoverage]
    public class RefinementGroupsModel
    {
        public string Group { get; set; }
        public List<RefinementsModel> Refinements { get; set; }

    }
}
