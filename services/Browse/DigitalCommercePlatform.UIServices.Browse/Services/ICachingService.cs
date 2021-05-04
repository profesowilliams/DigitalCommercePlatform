using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface ICachingService
    {
        Task<List<CategoryModel>> GetCatalogFromCache(string cacheKey);

        Task<bool> SetCatalogCache(List<CategoryModel> Catalog, string cacheKey);
    }
}