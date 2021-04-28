using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.GetMyQuotes;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class QuoteProfile : Profile
    {
        public QuoteProfile()
        {
            CreateMap<ActiveOpenQuotesModel, GetTopQuotes.Response>()
                .ForMember(dest => dest.Summary, opt => opt.MapFrom(src => src));

            CreateMap<MyQuotes, MyQuoteDashboard.Response>()
               .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));
        }
    }
}