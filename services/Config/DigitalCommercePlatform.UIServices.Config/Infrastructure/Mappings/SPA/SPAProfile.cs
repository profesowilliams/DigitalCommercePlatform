using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.FindSPA;
using DigitalCommercePlatform.UIServices.Config.Models.SPA;
using DigitalFoundation.Common.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.SPA
{
    [ExcludeFromCodeCoverage]
    public class SPAProfile : Profile
    {
        public SPAProfile()
        {
            CreateMap<SpaBase, SPAResponse>()
                .ForPath(dest => dest.DealId, o => o.MapFrom(src => src.Source.Id))
                .ForMember(dest => dest.Vendor, o => o.MapFrom(src => src.VendorName))
                .ForMember(dest => dest.Description, o => o.MapFrom(src => src.Description))
                .ForMember(dest => dest.EndUserName, o => o.MapFrom(src => src.EndUserName))
                .ForMember(dest => dest.Expires, o => o.MapFrom(src => src.ExpirationDate))
                .ForMember(dest => dest.Quotes, opt => opt.MapFrom(src=>src.Quotes));

            CreateMap<FindResponse<SpaBase>, GetSPA.Response>()
                .ForMember(dest => dest.response, opt => opt.MapFrom(src => src.Data))
                .ForMember(dest => dest.Count, opt => opt.MapFrom(src => src.Count));
        }
    }
}
