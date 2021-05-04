using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    [ExcludeFromCodeCoverage]
    public class CachingService : ICachingService
    {
        // keep it simpele, if additonal cahing is required write generic method
        private readonly IMemoryCache _cache;

        private readonly ILogger<CachingService> _logger;

        public CachingService(IMemoryCache cache, ILogger<CachingService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public Task<List<CategoryModel>> GetCatalogFromCache(string cacheKey)
        {
            List<CategoryModel> catalog = null;
            try
            {
                if (_cache.TryGetValue(cacheKey, out catalog))
                    return Task.FromResult(catalog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting Cataloge Cahing : " + nameof(CachingService));
            }
            return Task.FromResult(catalog);
        }

        public Task<bool> SetCatalogCache(List<CategoryModel> Catalog, string cacheKey)
        {
            try
            {
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(720)); // expires every 12 hours
                _cache.Set(cacheKey, Catalog, cacheEntryOptions);
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at setting Cataloge Cahing : " + nameof(CachingService));
            }

            return Task.FromResult(false);
        }
    }
}