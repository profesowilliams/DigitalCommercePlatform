//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel
{
    [ExcludeFromCodeCoverage]
    public class RegisterCustomerRequestModel
    {
        public string Id { get; set; }

        [Required]
        public SourceRegistrationModel Source { get; set; }

        [Required]
        public bool IsTandCAccepted { get; set; }

        [Required]
        public bool IsCommunicationsAccepted { get; set; }

        [Required]
        public CompanyRegistrationModel Company { get; set; }

        [Required]
        public ContactRegistrationModel Contact { get; set; }

        [Required]
        public AddressRegistrationModel Address { get; set; }

        public BankDetailsRegistrationModel BankDetails { get; set; }

        public TradingAccountRegistrationModel TradingAccount { get; set; }

        [Required]
        public AdminWebUserRegistrationModel AdminWebUser { get; set; }

        [Required]
        public DocumentsRegistrationModel[] Documents { get; set; }

        [Required]
        public string Created { get; set; }

        [Required]
        public string Updated { get; set; }
    }
}