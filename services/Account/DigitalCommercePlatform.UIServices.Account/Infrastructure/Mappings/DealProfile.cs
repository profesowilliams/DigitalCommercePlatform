using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

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
