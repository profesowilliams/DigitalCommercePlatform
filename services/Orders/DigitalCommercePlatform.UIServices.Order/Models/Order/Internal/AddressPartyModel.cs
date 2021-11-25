//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.Order.Internal
{
    [ExcludeFromCodeCoverage]
    public class AddressPartyModel : ContactPartyModel
    {
        public AddressModel Address { get; set; }
    }
}
