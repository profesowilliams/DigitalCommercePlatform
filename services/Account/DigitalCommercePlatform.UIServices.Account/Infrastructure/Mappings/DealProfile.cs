using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.TopDeals;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class DealProfile : Profile
    {
        public DealProfile()
        {
            CreateMap<List<DealsSummaryModel>, GetDealsSummary.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

            CreateMap<DealModel, GetTopDeals.Response>()
             .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));
        }
    }
}
