//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Models.Accounts;
using DigitalFoundation.Common.Security.Messages;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class SecurityProfile : Profile
    {
        public SecurityProfile()
        {
            CreateMap<DigitalFoundation.Common.Features.Contexts.Models.SalesDivision, SalesDivision>();

            CreateMap<DigitalFoundation.Common.Features.Contexts.Models.Customer, Customer>()
                .ForMember(dest => dest.Number, opt => opt.MapFrom(src => src.CustomerNumber))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.CustomerName))
                .ForMember(dest => dest.SalesOrg, opt => opt.MapFrom<SalesOrgResolver>());

            CreateMap<DigitalFoundation.Common.Features.Contexts.Models.User, User>()
                .ForMember(dest => dest.CustomersV2, opt => opt.MapFrom(src => src.CustomerList))
                .ForMember(dest => dest.Roles, opt => opt.Ignore())
                .ForMember(dest => dest.RoleList, opt => opt.MapFrom(src => src.RoleList));


            CreateMap<ValidateUserResponseModel, AuthenticateUser.Response>();
        }

        [ExcludeFromCodeCoverage]
        public class CompanyNameResolver : IValueResolver<DigitalFoundation.Common.Features.Contexts.Models.User, User, string>
        {
            public string Resolve(DigitalFoundation.Common.Features.Contexts.Models.User source, User destination, string destMember, ResolutionContext context)
            {
                // Current requirement is to take the first customer from the list
                return source?.CustomerList?.FirstOrDefault()?.CustomerName;
            }
        }

        [ExcludeFromCodeCoverage]
        public class SalesOrgResolver : IValueResolver<DigitalFoundation.Common.Features.Contexts.Models.Customer, Customer, string>
        {
            public string Resolve(DigitalFoundation.Common.Features.Contexts.Models.Customer source, Customer destination, string destMember, ResolutionContext context)
            {
                // Current requirement is to take the first customer from the list
                return source?.SalesDivision?.FirstOrDefault()?.SalesOrg;
                //return source?.SalesDivision?.Where(s=>s.CustomerGroupCodes.Contains("GV4")).FirstOrDefault().SalesOrg;
            }
        }
    }
}
