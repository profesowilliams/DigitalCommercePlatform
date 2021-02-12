using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface ICachingServicec
    {
        Task<GetCatalogueResponse> GetCatalogueFromCache(string cacheKey);
        Task<bool> SetCatalogueCache(GetCatalogueResponse catalogue, string cacheKey);
    }
}
