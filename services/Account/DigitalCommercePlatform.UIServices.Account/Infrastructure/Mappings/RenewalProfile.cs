using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.RenewalsSummary;
using DigitalCommercePlatform.UIServices.Account.Models.Renewals;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{

    [ExcludeFromCodeCoverage]
    public class RenewalProfile : Profile
    {
        public RenewalProfile()
        {
            CreateMap<List<RenewalsSummaryModel>, GetRenewalsSummary.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

        }
    }
}
