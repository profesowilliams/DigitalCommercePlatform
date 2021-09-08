//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class EndUserModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<ContactModel> Contact { get; set; }
        public AddressModel Address { get; set; }
    }
}
