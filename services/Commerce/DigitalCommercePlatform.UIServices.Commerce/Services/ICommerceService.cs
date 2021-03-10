using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute.DetailsOfOrderQuote;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface ICommerceService
    {
        Task<string> GetQuote(string Id); 
        Task<string> GetQuotes(string Id);       
        Task<OrderModel> GetOrderByIdAsync(string id);
        Task<OrdersContainer> GetOrdersAsync(SearchCriteria orderParameters);
        Task<QuoteDetailModel> GetOrderQuote(Request request)
    }
}
