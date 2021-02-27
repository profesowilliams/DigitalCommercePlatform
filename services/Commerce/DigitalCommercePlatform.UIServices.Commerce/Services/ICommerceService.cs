using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface ICommerceService
    {
        Task<string> GetQuote(string Id); 
        Task<string> GetQuotes(string Id);       
        Task<OrderModel> GetOrderByIdAsync(string id);
        Task<OrdersContainer> GetOrdersAsync(SearchCriteria orderParameters);
    }
}
