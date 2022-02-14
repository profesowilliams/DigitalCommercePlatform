//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.RegisterCustomer;
using DigitalCommercePlatform.UIServices.Account.Models.Customers;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly string _customerServiceURL;
        private readonly IUIContext _uiContext;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<CustomerService> _logger;
        private readonly IMapper _mapper;

        public record CustomerServiceArgs(
            IMiddleTierHttpClient middleTierHttpClient,
            IAppSettings appSettings,
            ILogger<CustomerService> logger,
            IMapper mapper,
            IUIContext uiContext
            );

        public CustomerService(CustomerServiceArgs args)
        {
            _uiContext = args.uiContext;
            _middleTierHttpClient = args.middleTierHttpClient;
            _logger = args.logger;
            _mapper = args.mapper;
            _customerServiceURL = args.appSettings.GetSetting("App.Customer.Url");
        }

        public async Task<ResponseBase<RegisterCustomer.Response>> RegisterCustomerAsync(RegisterCustomer.Request request, CancellationToken cancellationToken)
        {
            var url = _customerServiceURL.AppendPathSegment("/RegisterCustomer");

            try
            {
                var dto = _mapper.Map<Models.Customers.RegisterCustomerDto.RegisterCustomerRequestDto>(request.RegistrationRequest);
                _logger.LogInformation("Sending request to App.Customer - RegisterCustomer");

                var registerResponse = await _middleTierHttpClient.PostAsync<RegisterCustomerResponseModel>(url, body: dto);

                return MapResponse(registerResponse);
            }
            catch (Exception)
            {
                return new ResponseBase<RegisterCustomer.Response>()
                {
                    Error = new ErrorInformation()
                    {
                        IsError = true,
                        Messages = new System.Collections.Generic.List<string>() { "Internal error occurred while processing your request" }
                    }
                };
            }
        }

        private static ResponseBase<RegisterCustomer.Response> MapResponse(RegisterCustomerResponseModel registerResponse)
        {
            return new ResponseBase<RegisterCustomer.Response>()
            {
                Error = new ErrorInformation()
                {
                    IsError = (bool)registerResponse?.IsError,
                    Messages = new System.Collections.Generic.List<string>() { registerResponse?.ErrorDescription }
                }
            };
        }
    }
}