using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorReference;
using DigitalCommercePlatform.UIServices.Account.Models.Vendors;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class VendorProfile : Profile
    {
        public VendorProfile()
        {
            CreateMap<List<VendorReferenceModel>, GetVendorReference.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));
        }
    }
}
