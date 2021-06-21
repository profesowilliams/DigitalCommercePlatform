using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Services
{
    public class CacheServiceTest
    {
        private readonly ICachingService _cachingService;
        private readonly Mock<ILogger<CachingService>> _cachelogger;
        private readonly IMemoryCache _memoryCache;

        public CacheServiceTest()
        {
            _cachelogger = new Mock<ILogger<CachingService>>();
            _memoryCache = new MemoryCache(new MemoryCacheOptions());
            _cachingService = new CachingService(_memoryCache, _cachelogger.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCatalogFromCache()
        {
            // Act
            var result = await _cachingService.GetCatalogFromCache("cache");
            // Assert
            Assert.Null(result);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetFeatureFromCache()
        {
            // Act
            var result = await _cachingService.GetFeatureFromCache("cache","key");
            // Assert
            Assert.NotNull(result);
        }

        [Theory]
        [AutoDomainData]
        public async Task ClearFromCache()
        {
            // Act
            var result = await _cachingService.ClearFromCache("cache");
            // Assert
            result.Should().BeTrue();
        }

        [Theory]
        [AutoDomainData]
        public async Task SetCatalogCache()
        {
            List<CatalogResponse> catalog = new List<CatalogResponse>();
            // Act
            var result = await _cachingService.SetCatalogCache(catalog, "key");
            // Assert
            result.Should().BeTrue();
        }
    }
}