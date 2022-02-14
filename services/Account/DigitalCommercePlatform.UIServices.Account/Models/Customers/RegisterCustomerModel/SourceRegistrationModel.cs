//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel
{
    [ExcludeFromCodeCoverage]
    public class SourceRegistrationModel
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string System { get; set; }
    }
}