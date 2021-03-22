using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract
{
    public abstract class HandlerBase<T> where T : class
    {
        protected readonly ILogger _logger;

        public HandlerBase(ILoggerFactory loggerFactory, IHttpClientFactory httpClientFactory)
        {
            _logger = loggerFactory.CreateLogger<T>();
        }

        protected async Task<U> GetAsync<U>(string url, string token, CancellationToken cancellationToken)
        {
            return await Task.FromResult(default(U));
        }
    }
}
