using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface ICachingService
    {
        Task<GetCatalogHandler.Response> GetCatalogFromCache(string cacheKey);

        Task<bool> SetCatalogCache(GetCatalogHandler.Response Catalog, string cacheKey);
    }
}