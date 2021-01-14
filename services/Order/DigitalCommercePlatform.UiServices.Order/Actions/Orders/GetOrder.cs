using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.DTO.Request;
using DigitalCommercePlatform.UIServices.Order.DTO.Response;
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

namespace DigitalCommercePlatform.UIServices.Order.Actions.Orders
{
    public class GetOrder
    {
#pragma warning disable CA1034 // Nested types should not be visible
        public class Handler : IRequestHandler<GetOrderRequest, GetOrderResponse>
#pragma warning restore CA1034 // Nested types should not be visible
        {
            private readonly IMapper _mapper;
            private readonly ILogger _logger;
            private readonly IMiddleTierHttpClient _client;
            private readonly string CoreOrderUrl;

            public Handler(IMapper mapper, IMiddleTierHttpClient client, ILoggerFactory loggerFactory,
                IOptions<AppSettings> options)
            {
                _mapper = mapper;
                _client = client;
                _logger = loggerFactory.CreateLogger<Handler>();

                const string key = "App.Order.Url";
                CoreOrderUrl = options?.Value?.TryGetSetting(key);
                if (CoreOrderUrl is null) throw new InvalidOperationException($"{key} is missing from {nameof(IOptions<AppSettings>)}");
            }

            public async Task<GetOrderResponse> Handle(GetOrderRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _logger.LogInformation($"UIService.Order.Id");
                    var url = CoreOrderUrl
                        .BuildQuery(request);

                    var coreResponse = await _client.GetAsync<PaginatedResponse<List<GetOrderResponse>>>(url).ConfigureAwait(false);
                    return _mapper.Map<GetOrderResponse>(coreResponse);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at: " + nameof(GetOrder));
                    throw;
                }
            }
        }

        public class Validator : AbstractValidator<GetOrderRequest>
        {
            public Validator()
            {
                RuleFor(c => c.Id).NotNull().NotEmpty();
            }
        }
    }
}
