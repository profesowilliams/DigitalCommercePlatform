//2022 (c) Tech Data Corporation - All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup.RefinementsDto
{
    [ExcludeFromCodeCoverage]
    public class RefinementGroupData
    {
        public List<VendorRefinement> VendorRefinements { get; set; }
        public List<EndUserRefinement> EndUserRefinements { get; set; }
        public List<RenewalTypeRefinement> RenewalTypeRefinements { get; set; }

        public bool IsEmpty =>
            VendorRefinements == null &&
            EndUserRefinements == null &&
            RenewalTypeRefinements == null;
    }
}
