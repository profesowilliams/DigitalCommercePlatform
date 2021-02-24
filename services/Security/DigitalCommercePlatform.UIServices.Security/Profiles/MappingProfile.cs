using AutoMapper;
using DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetToken;
using DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser;
using DigitalCommercePlatform.UIServices.Security.Models;
using DigitalFoundation.Common.Security.Messages;

namespace DigitalCommercePlatform.UIServices.Security.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ClientLoginCodeTokenResponseModel, GetTokenResponse>();
            CreateMap<DigitalFoundation.Common.Models.User, User>();
            CreateMap<ValidateUserResponseModel, GetUserResponse>();
        }
    }
}
