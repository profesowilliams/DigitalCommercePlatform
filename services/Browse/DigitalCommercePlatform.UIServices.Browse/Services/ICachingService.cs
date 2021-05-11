using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface ICachingService
    {
        Task<List<CatalogResponse>> GetCatalogFromCache(string cacheKey);

        Task<bool> SetCatalogCache(List<CatalogResponse> Catalog, string cacheKey);
    }
}