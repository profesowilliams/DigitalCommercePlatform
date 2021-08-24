//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models
{
    [ExcludeFromCodeCoverage]
    public class AccountAddressDetails
    {
        public string Name { get; set; }
        public List<Companies> Companies { get; set; }
        public List<AccountAddress> addresses { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class AccountAddress
    {
        public string AddressNumber { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Zip { get; set; }
        public string Email { get; set; }
        public string AddressType { get; set; }
        public string Phone { get; set; }
        public string SalesOrganization { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class Companies
    {
        public string companyCode { get; set; }
        public string paymentTermsCode { get; set; }
        public string paymentTermsText { get; set; }
    }
}
