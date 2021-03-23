using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals
{
    public class DealProfile : Profile
    {
        public DealProfile()
        {
            CreateMap<DealsDetailModel, GetDeal.Response>()
                .ForMember(dest => dest.Deals, opt => opt.MapFrom(src => src));

            CreateMap<RecentDealsModel, GetDeals.Response>()
                .ForMember(dest => dest.Deals, opt => opt.MapFrom(src => src));


        }
    }
}
