using DigitalCommercePlatform.UIServices.Order.Models.Order;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Services.Contracts
{
    public interface IOrderQueryServices
    {
        Task<OrderModel> GetOrderByIdAsync(string id);
        Task<OrdersContainer> GetOrdersAsync(string orderBy, bool sortAscending, int pageNumber, int pageSize);
    }
}
