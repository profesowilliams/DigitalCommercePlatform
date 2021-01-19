using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Infrastructure.Contracts;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;

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
            Mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
            Client = client ?? throw new ArgumentNullException(nameof(client));

            CoreOrder = ObjectExtensions.PassThrowNonNull(options).Value?.TryGetSetting(AppConstants.CoreOrderKey);
            StringExtensions.PassThrowNonNull(CoreOrder);
        }
    }
}