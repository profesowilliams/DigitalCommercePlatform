using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Actions
{
    public abstract class RequestHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        protected abstract void LogError(Exception exception);
        protected abstract Task<TResponse> OnHandle(TRequest request, CancellationToken cancellationToke);
        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken)
        {
            try
            {
                return await OnHandle(request, cancellationToken).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                if (ex is RemoteServerHttpException { Code: System.Net.HttpStatusCode.NotFound })
                    return default;
                LogError(ex);
                throw;
            }
        }
    }
}
