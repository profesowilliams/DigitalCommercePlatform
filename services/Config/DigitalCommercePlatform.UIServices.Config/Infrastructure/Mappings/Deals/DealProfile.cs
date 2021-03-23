using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals
{
    public class DealProfile : Profile
    {
        [ExcludeFromCodeCoverage]
        public DealProfile()
        {
            CreateMap<DealsDetailModel, GetDeal.Response>()
                .ForMember(dest => dest.Deals, opt => opt.MapFrom(src => src));

            CreateMap<RecentDealsModel, GetDeals.Response>()
                .ForMember(dest => dest.Deals, opt => opt.MapFrom(src => src));

        }
    }
}
