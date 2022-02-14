//2022 (c) Tech Data Corporation -. All Rights Reserved.

using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel
{
    [ExcludeFromCodeCoverage]
    public class TradingAccountRegistrationModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string State { get; set; }

        [Required]
        public string Zip { get; set; }

        [Required]
        public string Country { get; set; }
    }
}