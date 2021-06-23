using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Customer.Models
{
    [ExcludeFromCodeCoverage]
    public class AddressDetails
    {
        public string Name { get; set; }
        public List<Companies> Companies { get; set; }
        public List<Address> addresses { get; set; }
    }
}
