//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals.Internal
{
    [ExcludeFromCodeCoverage]
    public class PartyDetailedDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string NameUpper { get; set; }
        public List<ContactDetailedDto> Contact { get; set; }
        public AddressDto Address { get; set; }
    }
}
