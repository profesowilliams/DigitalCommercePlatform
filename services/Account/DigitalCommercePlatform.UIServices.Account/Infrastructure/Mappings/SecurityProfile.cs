using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class SecurityProfile : Profile
    {
        public SecurityProfile()
        {
            CreateMap<DigitalFoundation.Common.Models.User, User>();
        }
    }
}
