using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Order.Services
{
    public interface IOrderQueryServices
    {
        Task<OrderDto> GetOrderByIdAsync(string id);
        Task<OrdersCollectionDto> GetOrdersAsync(string orderBy, bool sortAscending);
    }
}
