using AutoMapper;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class VendorProfile : Profile
    {
        public VendorProfile()
        {
            //CreateMap<List<VendorConnect>, GetVendorReference.Response>()
            //    .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));
        }
    }
}
