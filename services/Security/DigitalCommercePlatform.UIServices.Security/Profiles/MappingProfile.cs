using AutoMapper;
using DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetToken;
using DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser;
using DigitalFoundation.Common.Security.Messages;

namespace DigitalCommercePlatform.UIServices.Security.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ClientLoginCodeTokenResponseModel, GetTokenResponse>();
            CreateMap<DigitalFoundation.Common.Models.User, UserDto>();
            CreateMap<ValidateUserResponseModel, GetUserResponse>();
        }
    }
}
