using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.SavedCartsList;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class CartProfile : Profile
    {
        public CartProfile()
        {                 
            CreateMap<SavedCartDetailsModel, SavedCartsResponse>()
            .ForMember(dest => dest.Id, src => src.MapFrom(src => src.Source.Id))
            .ForMember(dest => dest.system, src => src.MapFrom(src => src.Source.system))
            .ForMember(dest => dest.Name, src => src.MapFrom(src => src.Name));

            CreateMap<List<SavedCartsResponse>, GetCartsList.Response>()
            .ForMember(d => d.Items, s => s.MapFrom(src => src))
            .ForMember(d => d.TotalRecords, s => s.MapFrom(src => src.Count()));
        }
    }
}
