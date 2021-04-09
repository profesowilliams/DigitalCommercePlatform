using DigitalCommercePlatform.UIService.Product.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.HttpClients
{
    public interface IPriceClient
    {
        Task<Dictionary<string, PriceModel>> GetMultipleAsync(string[] ids);
    }
}