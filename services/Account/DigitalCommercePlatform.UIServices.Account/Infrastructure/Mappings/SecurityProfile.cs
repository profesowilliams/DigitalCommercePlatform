using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalFoundation.Common.Security.Messages;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class SecurityProfile : Profile
    {
        public SecurityProfile()
        {
            CreateMap<ClientLoginCodeTokenResponseModel, AuthenticateUser.Response>();
            CreateMap<DigitalFoundation.Common.Models.User, User>();
        }
    }
}
