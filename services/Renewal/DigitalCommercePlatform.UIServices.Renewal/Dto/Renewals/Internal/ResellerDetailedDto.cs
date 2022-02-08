//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals.Internal
{
    [ExcludeFromCodeCoverage]
    public class ResellerDetailedDto : PartyDetailedDto
    {
        public string VendorAccountName { get; set; }
        public string VendorAccountNumber { get; set; }
    }
}
