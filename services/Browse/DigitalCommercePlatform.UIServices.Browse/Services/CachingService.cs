using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public class CachingService : ICachingServicec
    {
        // keep it simpele, if additonal cahing is required write generic method
        private IMemoryCache _cache;
        private readonly ILogger<CachingService> _logger;
        public CachingService(IMemoryCache cache, ILogger<CachingService> logger)
        {
            _cache = cache;
            _logger = logger;
        }
        public Task<GetCatalogueResponse> GetCatalogueFromCache(string cacheKey)
        {
            var catalogue = new GetCatalogueResponse();

            try
            {
                if (_cache.TryGetValue(cacheKey, out catalogue))          
                    return Task.FromResult(catalogue);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting Cataloge Cahing : " + nameof(CachingService));
            }
            return Task.FromResult(catalogue);
        }

        public Task<bool> SetCatalogueCache(GetCatalogueResponse catalogue, string cacheKey)
        {
            try
            {
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(720)); // expires every 12 hours
                _cache.Set(cacheKey, catalogue, cacheEntryOptions);
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
