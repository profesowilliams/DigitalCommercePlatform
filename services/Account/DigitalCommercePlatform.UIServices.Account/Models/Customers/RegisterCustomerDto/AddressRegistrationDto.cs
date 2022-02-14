//2022 (c) Tech Data Corporation -. All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerDto
{
    [ExcludeFromCodeCoverage]
    public class AddressRegistrationDto
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Country { get; set; }
    }
}