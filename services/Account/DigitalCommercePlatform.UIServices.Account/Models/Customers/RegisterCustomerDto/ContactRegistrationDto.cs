//2022 (c) Tech Data Corporation -. All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerDto
{
    [ExcludeFromCodeCoverage]
    public class ContactRegistrationDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
    }
}