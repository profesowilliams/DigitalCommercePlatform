using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
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

        public Task<List<CatalogResponse>> GetCatalogFromCache(string cacheKey)
        {
            List<CatalogResponse> catalog = null;
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

        public Task<string> GetFeatureFromCache(string cacheKey, string keyValue)
        {
            try
            {
                string value = string.Empty;
                _cache.TryGetValue(cacheKey, out value);
                if (!keyValue.Equals(value))
                    _cache.Remove(cacheKey);
                else
                    return Task.FromResult(keyValue);

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(720)); // expires every 12 hours
                _cache.Set(cacheKey, keyValue, cacheEntryOptions);
                return Task.FromResult(keyValue);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting Cache from Feature value " + nameof(CachingService));
            }
            throw new NotImplementedException();
        }


        public Task<bool> ClearFromCache(string cacheKey)
        {
            try
            {
                _cache.Remove(cacheKey);
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at clearing Cache from Feature value " + nameof(CachingService));
                return Task.FromResult(false);
            }

        }

        public Task<bool> SetCatalogCache(List<CatalogResponse> Catalog, string cacheKey)
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