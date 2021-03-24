using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.RenewalsSummary;
using DigitalCommercePlatform.UIServices.Account.Models.Renewals;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{

    [ExcludeFromCodeCoverage]
    public class RenewalProfile : Profile
    {
        public RenewalProfile()
        {
            CreateMap<RenewalsSummaryModel, GetRenewalsSummary.Response>()
                .ForMember(dest => dest.Summary, opt => opt.MapFrom(src => src));

        }
    }
}
