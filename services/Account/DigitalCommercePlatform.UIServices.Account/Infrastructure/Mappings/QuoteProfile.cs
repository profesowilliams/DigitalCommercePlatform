//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.GetMyQuotes;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class QuoteProfile : Profile
    {
        public QuoteProfile()
        {
            CreateMap<QuoteStatistics, MyQuoteDashboard.Response>()
               .ForPath(dest => dest.Items.Converted, opt => opt.MapFrom(src => string.Format("{0} %", src.Percentage)))
               .ForPath(dest => dest.Items.Open, opt => opt.MapFrom(src => src.Open))
               .ForPath(dest => dest.Items.QuoteToOrder, opt => opt.MapFrom(src => string.Format("{0}:{1}", src.Ratio, 1)))
                .ForPath(dest => dest.Items.ActiveQuoteValue, opt => opt.MapFrom(src => src.QuoteValue))
               .ForPath(dest => dest.Items.FormattedAmount, opt => opt.MapFrom(src => string.Format("{0:N2}", src.QuoteValue)));

            CreateMap<QuoteModel, OpenResellerItems>()
                .ForMember(dest => dest.Sequence, opt => opt.Ignore())
                .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.EndUserName, opt => opt.MapFrom<EndUserNameResolver>())
                .ForMember(dest => dest.CurrencyCode, opt => opt.MapFrom(src => src.Currency))
                .ForMember(dest => dest.CurrencySymbol, opt => opt.MapFrom(src => src.CurrencySymbol))
                .ForMember(dest => dest.FormattedAmount, opt => opt.MapFrom(src => string.Format("{0:N2}", src.Price)));

            CreateMap<FindResponse<IEnumerable<QuoteModel>>, GetTopQuotes.Response>()
                .ForMember(dest => dest.Summary, opt => opt.MapFrom(src => src.Data));
        }
    }

    [ExcludeFromCodeCoverage]
    public class EndUserNameResolver : IValueResolver<QuoteModel, OpenResellerItems, string>
    {
        public string Resolve(QuoteModel source, OpenResellerItems destination, string destMember, ResolutionContext context)
        {
            string description = string.IsNullOrWhiteSpace(source.EndUser?.Name) ? string.IsNullOrWhiteSpace(source.ShipTo?.Name)?source.Reseller?.Name: source.ShipTo?.Name : source.EndUser?.Name;
            return description;
        }
    }
}
