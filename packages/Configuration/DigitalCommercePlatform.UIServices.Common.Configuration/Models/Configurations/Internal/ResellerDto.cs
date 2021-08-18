using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Configuration.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class ResellerDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string NameUpper { get; set; }
        public string Duns { get; set; }
        public string Url { get; set; }
        public string VendorAccountName { get; set; }
        public string VendorAccountNumber { get; set; }
        public ContactDto ContactModel { get; set; }
        public AddressDto Address { get; set; }
    }
}
