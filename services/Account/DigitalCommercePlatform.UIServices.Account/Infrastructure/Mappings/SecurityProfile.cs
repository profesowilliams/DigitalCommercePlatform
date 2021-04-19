using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalFoundation.Common.Security.Messages;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class SecurityProfile : Profile
    {
        public SecurityProfile()
        {
            CreateMap<DigitalFoundation.Common.Models.User, User>()
                .ForMember(dest => dest.CustomersV2, opt => opt.MapFrom<CustomerResolver>()); 


            CreateMap<ValidateUserResponseModel, AuthenticateUser.Response>();
        }
    }

    // Temporary code. When core-security team will provide customers this code will be removed
    [ExcludeFromCodeCoverage]
    public class CustomerResolver : IValueResolver<DigitalFoundation.Common.Models.User, User, IEnumerable<Customer>>
    {
        public IEnumerable<Customer> Resolve(DigitalFoundation.Common.Models.User source, User destination, IEnumerable<Customer> destMember, ResolutionContext context)
        {
            return source?.Customers?.Select((x,i) => new Customer { Number = x, Name = $"Company {i}" })?.ToList();
        }
    }
}
