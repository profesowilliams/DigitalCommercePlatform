using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Models.Deals.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals
{
    [ExcludeFromCodeCoverage]
    public class DealProfile : Profile
    {       
        public DealProfile()
        {
            CreateMap<Models.Deals.FindModel, Models.Deals.Internal.FindModel>();
            CreateMap<AppServiceDeal, Deal>();

            CreateMap<DealsDetailModel, GetDeal.Response>()
                .ForMember(dest => dest.Deals, opt => opt.MapFrom(src => src));

            CreateMap<List<Deal>, GetDeals.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

        }
    }
}
