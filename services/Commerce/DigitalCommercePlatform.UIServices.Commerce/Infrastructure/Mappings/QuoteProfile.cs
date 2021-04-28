using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using System.Diagnostics.CodeAnalysis;
using static DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute.DetailsOfSavedCartsQuote;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class QuoteProfile : Profile
    {
        public QuoteProfile()
        {
            CreateMap<QuoteDetailModel, Response>();
            CreateMap<FindResponse<IEnumerable<QuoteModel>>, FindQuotes.Response>();

            CreateMap<QuoteModel, GetQuote.Response>()
                .ForMember(dest => dest.Details, opt => opt.MapFrom(src => src));

            CreateMap<QuoteModel, QuotesForGridModel>()
             .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.ID))
             .ForMember(dest => dest.QuoteReference, opt => opt.MapFrom(src => src.Description))
             .ForMember(dest => dest.Vendor, opt => opt.MapFrom(src =>src.VendorReference.FirstOrDefault().Type))//Need to have reference
             .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.Created))
             .ForMember(dest => dest.Expires, opt => opt.MapFrom(src => src.Expiry))
             .ForMember(dest => dest.EndUserName, opt => opt.MapFrom(src => src.EndUser.Name))
             .ForMember(dest => dest.DealId, opt => opt.MapFrom(src => src.VendorReference.FirstOrDefault().Value))//Need to write a function to return dealID and return Multiple for multiple DealId's
             .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
             .ForMember(dest => dest.QuoteValue, opt => opt.MapFrom(src => src.Price))
             .ForMember(dest => dest.FormatedQuoteValue, opt => opt.MapFrom(src => src.Currency)) 
             .ForMember(dest => dest.CanUpdate, opt => opt.MapFrom(src => string.Join( "","true")))
             .ForMember(dest => dest.CanCheckOut, opt => opt.MapFrom(src => string.Join( "","True")))
             ;
            CreateMap<FindResponse<IEnumerable<QuoteModel>>, GetQuotesForGrid.Response>()
                 .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Data));
            
        }

    }
}
