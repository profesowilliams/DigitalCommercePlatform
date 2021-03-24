using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{

    [ExcludeFromCodeCoverage]
    public class DealProfile : Profile
    {
        public DealProfile()
        {
            CreateMap<DealsSummaryModel, GetDealsSummary.Response>()
                .ForMember(dest => dest.Summary, opt => opt.MapFrom(src => src));

        }
    }
}
