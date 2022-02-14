//2022 (c) Tech Data Corporation -. All Rights Reserved.

using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel
{
    [ExcludeFromCodeCoverage]
    public class CompanyRegistrationModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string NameUpper { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Phone { get; set; }

        [Required]
        public string Website { get; set; }

        [Required]
        public string CompanyType { get; set; }

        [Required]
        public DateTime CompanyFormationDate { get; set; }

        [Required]
        public string VATNumber { get; set; }

        [Required]
        public string RegistrationNumber { get; set; }

        [Required]
        public string InvoiceEmail { get; set; }
    }
}