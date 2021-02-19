using DigitalCommercePlatform.UIService.Product.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.HttpClients
{
    public interface IStockClient
    {
        Task<IDictionary<string, StockModel>> GetMultipleAsync(string[] ids);
    }
}
