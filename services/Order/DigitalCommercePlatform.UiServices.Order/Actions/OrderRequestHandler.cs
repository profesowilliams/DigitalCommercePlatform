using AutoMapper;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace DigitalCommercePlatform.UIServices.Order.Actions
{
    public abstract class OrderRequestHandler<TRequest, TResponse> :
        RequestHandler<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        protected IMapper Mapper { get; }
        protected ILogger Logger { get; }
        protected IMiddleTierHttpClient Client { get; }
        protected string CoreOrder { get; private set; }
        protected OrderRequestHandler(
            IMapper mapper,
            ILogger logger,
            IMiddleTierHttpClient client,
            IOptions<AppSettings> options)
        {
            Mapper = mapper;
            Logger = logger;
            Client = client;

            const string key = "Core.Order.Url";
            CoreOrder = options?.Value?.GetSetting(key);
        }
    }
}
