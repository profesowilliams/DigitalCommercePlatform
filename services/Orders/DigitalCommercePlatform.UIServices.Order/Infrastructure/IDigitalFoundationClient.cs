//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Infrastructure
{
    public interface IDigitalFoundationClient
    {
        Task<TResp> GetAsync<TResp>(string endpoint, string userId);

        Task<TResp> GetAsync<TResp>(string endpoint, IEnumerable<object> routeParams = null,
            IDictionary<string, object> queryParams = null, IDictionary<string, string> customHeaders = null);
    }
}