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
            CreateMap<DigitalFoundation.Common.Models.SalesDivision, SalesDivision>();

            CreateMap<DigitalFoundation.Common.Models.Customer, Customer>()
                .ForMember(dest => dest.Number, opt => opt.MapFrom(src => src.CustomerNumber))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.CustomerName))
                .ForMember(dest => dest.SalesOrg, opt => opt.MapFrom<SalesOrgResolver>());

            CreateMap<DigitalFoundation.Common.Models.User, User>()
                .ForMember(dest => dest.CustomersV2, opt => opt.MapFrom(src => src.CustomerList))
                .ForMember(dest => dest.RoleList, opt => opt.MapFrom(src => src.RoleList));


            CreateMap<ValidateUserResponseModel, AuthenticateUser.Response>();
        }

        [ExcludeFromCodeCoverage]
        public class CompanyNameResolver : IValueResolver<DigitalFoundation.Common.Models.User, User, string>
        {
            public string Resolve(DigitalFoundation.Common.Models.User source, User destination, string destMember, ResolutionContext context)
            {
                // Current requirement is to take the first customer from the list
                return source?.CustomerList?.FirstOrDefault()?.CustomerName;
            }
        }

        [ExcludeFromCodeCoverage]
        public class SalesOrgResolver : IValueResolver<DigitalFoundation.Common.Models.Customer, Customer, string>
        {
            public string Resolve(DigitalFoundation.Common.Models.Customer source, Customer destination, string destMember, ResolutionContext context)
            {
                // Current requirement is to take the first customer from the list
                return source?.SalesDivision?.FirstOrDefault()?.SalesOrg;
                //return source?.SalesDivision?.Where(s=>s.CustomerGroupCodes.Contains("GV4")).FirstOrDefault().SalesOrg;
            }
        }
    }
}
