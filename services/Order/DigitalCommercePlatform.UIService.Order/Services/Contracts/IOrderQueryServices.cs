using DigitalCommercePlatform.UIService.Order.Models.Order;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Order.Services.Contracts
{
    public interface IOrderQueryServices
    {
        Task<OrderModel> GetOrderByIdAsync(string id);
        Task<OrdersContainer> GetOrdersAsync(string orderBy, bool sortAscending);
    }
}
