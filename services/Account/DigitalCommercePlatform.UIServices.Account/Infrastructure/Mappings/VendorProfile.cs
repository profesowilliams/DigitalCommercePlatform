using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorAuthorizedURL;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class VendorProfile : Profile
    {
        public VendorProfile()
        {
            CreateMap<string, getVendorAuthorizeURL.Response>()
                .ForMember(dest => dest.URL, opt => opt.MapFrom(src => src));

        }
    }
}
