using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface ICachingService
    {
        Task<GetCatalogHandler.GetCatalogResponse> GetCatalogFromCache(string cacheKey);

        Task<bool> SetCatalogCache(GetCatalogHandler.GetCatalogResponse Catalog, string cacheKey);
    }
}