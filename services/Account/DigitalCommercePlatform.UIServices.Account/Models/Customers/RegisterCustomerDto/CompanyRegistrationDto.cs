//2022 (c) Tech Data Corporation -. All Rights Reserved.

using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerDto
{
    [ExcludeFromCodeCoverage]
    public class CompanyRegistrationDto
    {
        public string Name { get; set; }
        public string NameUpper { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Website { get; set; }
        public string CompanyType { get; set; }
        public DateTime CompanyFormationDate { get; set; }
        public string VATNumber { get; set; }
        public string RegistrationNumber { get; set; }
        public string InvoiceEmail { get; set; }
    }
}