using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuotes;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using System.Diagnostics.CodeAnalysis;
using static DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute.DetailsOfSavedCartsQuote;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuoteDetails;
using System.Linq;

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

            CreateMap<QuoteModel, RecentQuotesModel>()
             .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.ID))
             .ForMember(dest => dest.Reference, opt => opt.MapFrom(src => src.VendorReference.FirstOrDefault().Value))//Need to have reference
             .ForMember(dest => dest.Vendor, opt => opt.MapFrom(src =>src.VendorReference.FirstOrDefault().Type))//Need to have reference
             .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.Created))
             .ForMember(dest => dest.Expires, opt => opt.MapFrom(src => src.Expiry))
             .ForMember(dest => dest.EndUserName, opt => opt.MapFrom(src => src.EndUser.Name))
             .ForMember(dest => dest.DealId, opt => opt.MapFrom(src => string.Join( "","RG8965430721")))//Need to have reference
             .ForMember(dest => dest.Status, opt => opt.MapFrom(src => string.Join( "","OPEN")))//Need to have reference
             .ForMember(dest => dest.QuoteValue, opt => opt.MapFrom(src => src.Price))
             .ForMember(dest => dest.FormatedQuoteValue, opt => opt.MapFrom(src => src.Currency)) 
             .ForMember(dest => dest.CanUpdate, opt => opt.MapFrom(src => string.Join( "","true")))
             .ForMember(dest => dest.CanCheckOut, opt => opt.MapFrom(src => string.Join( "","True")))
             ;
            CreateMap<FindResponse<IEnumerable<QuoteModel>>, GetQuotes.Response>()
                 .ForMember(dest => dest.RecentQuotes, opt => opt.MapFrom(src => src.Data));
            
        }

    }
}
