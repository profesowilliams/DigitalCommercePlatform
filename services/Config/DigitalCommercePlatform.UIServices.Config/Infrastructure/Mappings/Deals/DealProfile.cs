using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals
{
    [ExcludeFromCodeCoverage]
    public class DealProfile : Profile
    {       
        public DealProfile()
        {
            CreateMap<DealsDetailModel, GetDeal.Response>()
                .ForMember(dest => dest.Deals, opt => opt.MapFrom(src => src));

            CreateMap<List<Deal>, GetDeals.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

        }
    }
}
