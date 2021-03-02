using AutoMapper;
using DigitalCommercePlatform.UIServices.Quote.Models;
using DigitalFoundation.App.Services.Quote.DTO.Common;
using DigitalFoundation.App.Services.Quote.Models.Quote;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Quote.Infrastructure.Mappings
{
    public class QuoteProfile : Profile
    {
        public QuoteProfile()
        {
            CreateMap<QuoteModel, TdQuoteForGrid>()
                .ForMember(destination => destination.SourceOriginId, opts => opts.MapFrom(source => source.Source.ID))
                //.ForMember(destination => destination.MyQuoteReference, opts => opts.MapFrom(source => source.Source.ID))
                .ForMember(destination => destination.EndUserName, opts => opts.MapFrom(source => source.EndUser.Name))
                //.ForMember(destination => destination.DealId, opts => opts.MapFrom(source => source.Source.ID))
                //.ForMember(destination => destination.QuoteValue, opts => opts.MapFrom(source => source.Price))
                //.ForMember(destination => destination.QuoteCreationDate, opts => opts.MapFrom(source => source.Created))
                //.ForMember(destination => destination.QuoteExpirationDate, opts => opts.MapFrom(source => source.Expiry))
            ;
            CreateMap<FindResponse<IEnumerable<QuoteModel>>, FindResponse<IEnumerable<TdQuoteForGrid>>>();
        }
    }
}
