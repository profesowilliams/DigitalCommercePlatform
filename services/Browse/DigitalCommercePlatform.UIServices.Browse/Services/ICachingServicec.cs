using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Services
{
    public interface ICachingServicec
    {
        Task<GetCatalogueHandler.GetCatalogueResponse> GetCatalogueFromCache(string cacheKey);
        Task<bool> SetCatalogueCache(GetCatalogueHandler.GetCatalogueResponse catalogue, string cacheKey);
    }
}
