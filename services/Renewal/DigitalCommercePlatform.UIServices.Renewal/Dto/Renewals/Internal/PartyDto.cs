//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals.Internal
{
    [ExcludeFromCodeCoverage]
    public class PartyDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string NameUpper { get; set; }
        public ContactDto Contact { get; set; }
        public AddressDto Address { get; set; }
    }
}
