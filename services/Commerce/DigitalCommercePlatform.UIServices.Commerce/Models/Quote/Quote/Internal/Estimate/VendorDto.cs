using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate
{
    [ExcludeFromCodeCoverage]
    public class AdditionalIdentifierDto
    {
        public string Type { get; set; }
        public string Id { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class VendorDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string VendorsTDName { get; set; }
        public string VendorsTDNumber { get; set; }
    }
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

    [ExcludeFromCodeCoverage]
    public class ResellerDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Duns { get; set; }
        public string Url { get; set; }
        public string VendorAccountName { get; set; }
        public ContactDto ContactModel { get; set; }
        public AddressDto Address { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class AddressDto
    {
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string County { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class ContactDto
    {
        public string Salutation { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initial { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
    }
}
