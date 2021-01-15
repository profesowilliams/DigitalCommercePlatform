using AutoMapper;
using DigitalCommercePlatform.UIService.Customer.Models.AppServices.Customer;
using DigitalCommercePlatform.UIService.Customer.Models.Dtos;
using DigitalCommercePlatform.UIService.Customer.Services.Abstract;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Get
{
    public class GetCustomerHandler : IRequestHandler<GetCustomerRequest, GetCustomerResponse>
    {
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly IMiddleTierHttpClient _client;
        private readonly string CoreCustomerUrl;

        private readonly IAppServiceConnector _appServiceConnector;


        public GetCustomerHandler(IMapper mapper, IMiddleTierHttpClient client, ILoggerFactory loggerFactory,
                IOptions<AppSettings> options, IAppServiceConnector appServiceConnector)
        {
            _mapper = mapper;
            _client = client;
            _logger = loggerFactory.CreateLogger<GetCustomerHandler>();

            _appServiceConnector = appServiceConnector;

            //TODO: move it to static constructor
            const string key = "Core.Customer.Url";
            CoreCustomerUrl = options?.Value?.TryGetSetting(key);
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
                var customerModel = await _appServiceConnector.GetCustomerAsync(request)
                    ?? new CustomerModel
                    {
                        Address = "Default address",
                        City = "Default city",
                        Country = "Any",
                        Name = "CustomerModel Name",
                        Phone = "(+48) 600700800",
                        SalesOrg = new List<string> { "0100", "0222" },
                        Source = null,
                        State = "Florida",
                        Type = "Default type",
                        Updated = DateTime.UtcNow,
                        ZIP = "24150"
                    };
                                              
                var getCustomerDto = _mapper.Map<GetCustomerDto>(customerModel);
                return new GetCustomerResponse(getCustomerDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at: " + nameof(Get));
                throw;
            }
        }
    }
}
