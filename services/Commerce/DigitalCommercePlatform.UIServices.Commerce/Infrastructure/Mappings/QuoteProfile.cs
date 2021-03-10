using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using System.Diagnostics.CodeAnalysis;
using static DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute.DetailsOfSavedCartsQuote;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class QuoteProfile : Profile
    {
        public QuoteProfile()
        {
            CreateMap<QuoteDetailModel, Response>();
        }
    }
}
