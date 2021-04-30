using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetPricingCondition;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface ICommerceService
    {
        Task<QuoteModel> GetQuote(GetQuote.Request request); 
        Task<string> GetQuotes(string Id);       
        Task<OrderModel> GetOrderByIdAsync(string id);
        Task<OrdersContainer> GetOrdersAsync(SearchCriteria orderParameters);
        Task<QuoteDetailModel> GetCartDetailsInQuote(SavedCartQuoteDetails.Request request);
        Task<FindResponse<IEnumerable<QuoteModel>>> FindQuotes(FindModel query);
        Task<CreateQuoteFrom.Response> CreateQuoteFrom(CreateQuoteFrom.Request request);
        Task<PricingConditionsModel> GetPricingConditions(GetPricingConditions.Request request);
        Task<CreateQuoteFrom.Response> CreateQuoteFromSavedCart(CreateQuoteFrom.Request request);
    }
}
