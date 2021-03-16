using DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuoteDetails;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuotes;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using System.Collections.Generic;
using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute.DetailsOfSavedCartsQuote;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface ICommerceService
    {
        Task<QuoteModel> GetQuote(GetQuote.Request request); 
        Task<string> GetQuotes(string Id);       
        Task<OrderModel> GetOrderByIdAsync(string id);
        Task<OrdersContainer> GetOrdersAsync(SearchCriteria orderParameters);
        Task<QuoteDetailModel> GetCartDetailsInQuote(Request request);
        Task<FindResponse<IEnumerable<QuoteModel>>> FindQuoteDetails(GetQuotes.Request request);

    }
}
