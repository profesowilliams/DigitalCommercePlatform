//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class EndUserDto
    {
        public string Name { get; set; }
        public string Duns { get; set; }
        public string VatNumber { get; set; }
        public string Url { get; set; }
        public string ParentCompany { get; set; }
        public string ParentCompanyNumber { get; set; }
        public string ParentAccountType { get; set; }
        public string IndustrySegment { get; set; }
        public string VendorAccountNumber { get; set; }
        public ContactDto Contact { get; set; }
        public AddressDto Address { get; set; }
    }
}
