//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Enums;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Customers
{
    [ExcludeFromCodeCoverage]
    public class RegisterCustomerResponseModel
    {
        public string CustomerNumber { get; set; }

        public string ErrorDescription { get; set; }

        public bool IsError { get; set; }
        public RegistrationErrorType ErrorType { get; set; }
    }
}