//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerDto;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class RegisterCustomerProfile : Profile
    {
        public RegisterCustomerProfile()
        {
            CreateMap<AddressRegistrationModel, AddressRegistrationDto>();
            CreateMap<AdminWebUserRegistrationModel, AdminWebUserRegistrationDto>();
            CreateMap<BankDetailsRegistrationModel, BankDetailsRegistrationDto>();
            CreateMap<CompanyRegistrationModel, CompanyRegistrationDto>();
            CreateMap<ContactRegistrationModel, ContactRegistrationDto>();
            CreateMap<DocumentsRegistrationModel, DocumentsRegistrationDto>();
            CreateMap<SourceRegistrationModel, SourceRegistrationDto>();
            CreateMap<TradingAccountRegistrationModel, TradingAccountRegistrationDto>();

            CreateMap<RegisterCustomerRequestModel, RegisterCustomerRequestDto>();
        }
    }
}