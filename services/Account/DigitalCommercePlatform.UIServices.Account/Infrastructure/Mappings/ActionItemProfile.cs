//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Models;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{

    [ExcludeFromCodeCoverage]
    public class ActionItemProfile : Profile
    {
        public ActionItemProfile()
        {
            CreateMap<ActionItemsModel, GetActionItems.Response>()
                .ForMember(dest => dest.Summary, opt => opt.MapFrom(src => src));

        }
    }
}
