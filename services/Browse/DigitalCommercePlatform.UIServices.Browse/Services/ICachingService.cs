//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface ICachingService
    {
        Task<List<CatalogResponse>> GetCatalogFromCache(string cacheKey);
        Task<bool> SetCatalogCache(List<CatalogResponse> Catalog, string cacheKey);
        Task<string> GetFeatureFromCache(string cacheKey, string keyValue);
        Task<bool> ClearFromCache(string cacheKey);
    }
}
