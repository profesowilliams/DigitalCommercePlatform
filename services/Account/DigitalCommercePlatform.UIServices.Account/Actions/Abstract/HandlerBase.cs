using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.Abstract
{
    // in this moment class is not used. we should think about use cases

    [ExcludeFromCodeCoverage]
    public abstract class HandlerBase<T> where T : class
    {
        protected readonly ILogger _logger;

        public HandlerBase(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<T>();
        }

        protected async Task<U> GetAsync<U>(string url, CancellationToken cancellationToken)
        {
            return await Task.FromResult(default(U));
        }
    }
}