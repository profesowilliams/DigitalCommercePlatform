//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class ResellerModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<ContactModel> Contact { get; set; }
        public AddressModel Address { get; set; }
    }
}
