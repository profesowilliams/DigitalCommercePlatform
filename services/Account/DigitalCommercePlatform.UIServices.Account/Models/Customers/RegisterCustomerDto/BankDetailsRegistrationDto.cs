//2022 (c) Tech Data Corporation -. All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerDto
{
    [ExcludeFromCodeCoverage]
    public class BankDetailsRegistrationDto
    {
        public string Name { get; set; }
        public string BranchCode { get; set; }
        public string SortCode { get; set; }
        public string AccountNumber { get; set; }
    }
}