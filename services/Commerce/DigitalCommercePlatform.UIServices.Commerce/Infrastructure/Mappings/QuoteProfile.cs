using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using static DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute.DetailsOfOrderQuote;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings
{
    public class QuoteProfile : Profile
    {
        public QuoteProfile()
        {
            CreateMap<QuoteDetailModel, Response>();
        }
    }
}
