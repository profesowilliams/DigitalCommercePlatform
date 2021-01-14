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
using DigitalCommercePlatform.UIServices.Customer.Actions.Customers.GetCustomer;
using DigitalCommercePlatform.UIServices.Browse.DTO.Request;
using DigitalCommercePlatform.UIServices.Browse.DTO.Response;

namespace DigitalCommercePlatform.UIServices.Customer.Actions.Customers.GetCustomer
{
    public class GetCustomerHandler : IRequestHandler<GetCustomerRequest, GetCustomerResponse>
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IMiddleTierHttpClient _client;
        private readonly string CoreCustomerUrl;
        public GetCustomerHandler(IMapper mapper, IMiddleTierHttpClient client, ILoggerFactory loggerFactory,
                IOptions<AppSettings> options)
        {
            _mapper = mapper;
            _client = client;
            _logger = loggerFactory.CreateLogger<GetCustomerHandler>();

            const string key = "Core.Customer.Url";
            CoreCustomerUrl = options?.Value?.TryGetSetting(key);
            if (CoreCustomerUrl is null) throw new InvalidOperationException($"{key} is missing from {nameof(IOptions<AppSettings>)}");
        }
        public async Task<GetCustomerResponse> Handle(GetCustomerRequest request, CancellationToken cancellationToken)
        {

            try
            {
                _logger.LogInformation($"AppService.Customer.Id");
                var url = CoreCustomerUrl
                    .BuildQuery(request);

                //var coreResponse = await _client.GetAsync<PaginatedResponse<List<CoreCustomer>>>(url).ConfigureAwait(false);
                //return _mapper.Map<GetCustomerResponse>(coreResponse);
                throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at: " + nameof(GetCustomer));
                throw;
            }
        }
    }
}
