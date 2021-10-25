//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalCommercePlatform.UIServices.Export.Models.UIServices.Commerce;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Services
{
    public interface ICommerceService
    {
        Task<QuoteModel> GetQuote(GetQuote.Request request);
        Task<Models.Order.Internal.OrderModel> GetOrderByIdAsync(string id);
    }
}
