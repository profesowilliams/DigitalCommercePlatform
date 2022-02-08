//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal
{
    [ExcludeFromCodeCoverage]
    public class ResellerModel : PartyModel
    {
        public string VendorAccountName { get; set; }
        public string VendorAccountNumber { get; set; }
    }
}
