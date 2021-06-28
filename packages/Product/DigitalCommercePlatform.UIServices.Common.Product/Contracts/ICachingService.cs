using DigitalCommercePlatform.UIServices.Common.Product.Models.Catalog;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Product.Contracts
{
    public interface ICachingService
    {
        Task<List<CatalogResponse>> GetCatalogFromCache(string cacheKey);
        Task<bool> SetCatalogCache(List<CatalogResponse> Catalog, string cacheKey);
        Task<string> GetFeatureFromCache(string cacheKey, string keyValue);
        Task<bool> ClearFromCache(string cacheKey);
    }
}
