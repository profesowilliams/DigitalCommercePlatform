//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal
{
    [ExcludeFromCodeCoverage]
    public class AddressModel
    {
        public string Name { get; set; }
        public AddressDetails Address { get; set; }
        public ContactModel Contact { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class ContactModel
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}
