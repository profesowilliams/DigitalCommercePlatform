using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuotes;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using System.Diagnostics.CodeAnalysis;
using static DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute.DetailsOfSavedCartsQuote;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuoteDetails;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class QuoteProfile : Profile
    {
        public QuoteProfile()
        {
            CreateMap<QuoteDetailModel, Response>();

            CreateMap<QuoteModel, GetQuote.Response>()
                .ForMember(dest => dest.Details, opt => opt.MapFrom(src => src));

       
            CreateMap<FindResponse<IEnumerable<QuoteModel>>, GetQuotes.Response>()
                 .ForMember(dest => dest.RecentQuotes, opt => opt.MapFrom(src => src.Data))
                //.ForPath(dest => dest.Data.Id, opt => opt.MapFrom(src => src.Data))
                ;
            
        }

    }
}
