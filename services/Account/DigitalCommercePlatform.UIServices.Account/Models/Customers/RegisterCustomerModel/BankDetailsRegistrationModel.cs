//2022 (c) Tech Data Corporation -. All Rights Reserved.

using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel
{
    [ExcludeFromCodeCoverage]
    public class BankDetailsRegistrationModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string BranchCode { get; set; }

        [Required]
        public string SortCode { get; set; }

        [Required]
        public string AccountNumber { get; set; }
    }
}