//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal
{
    [ExcludeFromCodeCoverage]
    public class PartyModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string NameUpper { get; set; }
        public IEnumerable<ContactModel> Contact { get; set; }
        public AddressModel Address { get; set; }
    }
}
