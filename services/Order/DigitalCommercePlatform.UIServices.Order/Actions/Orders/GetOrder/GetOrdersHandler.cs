using AutoMapper;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Core.Models.DTO.Common;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Order.Actions.Orders.GetOrder;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Orders.GetOrder
{
    public class GetOrdersHandler : IRequestHandler<GetOrderRequest, GetOrderResponse>
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IMiddleTierHttpClient _client;
        private readonly string CoreOrderUrl;
        public GetOrdersHandler(IMapper mapper, IMiddleTierHttpClient client, ILoggerFactory loggerFactory,
                IOptions<AppSettings> options)
        {
            _mapper = mapper;
            _client = client;
            _logger = loggerFactory.CreateLogger<GetOrdersHandler>();

            const string key = "Core.Order.Url";
            CoreOrderUrl = options?.Value?.TryGetSetting(key);
            if (CoreOrderUrl is null) throw new InvalidOperationException($"{key} is missing from {nameof(IOptions<AppSettings>)}");
        }
        public async Task<GetOrderResponse> Handle(GetOrderRequest request, CancellationToken cancellationToken)
        {

            try
            {
                _logger.LogInformation($"AppService.Order.Id");
                var url = CoreOrderUrl
                    .BuildQuery(request);

                //var coreResponse = await _client.GetAsync<PaginatedResponse<List<CoreOrder>>>(url).ConfigureAwait(false);
                //return _mapper.Map<GetOrderResponse>(coreResponse);
                throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at: " + nameof(GetOrder));
                throw;
            }
        }
    }
}
