//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Enums;
using DigitalCommercePlatform.UIServices.Account.Models.Customers;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Security.Token;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public class CustomerService : ICustomerService
    {
        private const string Scope = "ecom.api.customer";

        private readonly string _customerServiceURL;

        private readonly ISimpleHttpClient _simpleHttpClient;

        private readonly ITokenManagerService _tokenManagerService;
        private readonly ILogger<CustomerService> _logger;
        private readonly IMapper _mapper;

        public record CustomerServiceArgs(
            ISimpleHttpClient simpleHttpClient,
            ITokenManagerService tokenManagerService,
            IAppSettings appSettings,
            ILogger<CustomerService> logger,
            IMapper mapper
            );

        public CustomerService(CustomerServiceArgs args)
        {
            _simpleHttpClient = args.simpleHttpClient;
            _tokenManagerService = args.tokenManagerService;
            _logger = args.logger;
            _mapper = args.mapper;
            _customerServiceURL = args.appSettings.GetSetting("App.Customer.Url");
        }

        public async Task<RegisterCustomerResponseModel> RegisterCustomerAsync(RegisterCustomerRequestModel request, CancellationToken cancellationToken = default)
        {
            var url = _customerServiceURL.AppendPathSegment("/RegisterCustomer");

            var headers = new Dictionary<string, string>();

            await AddAuthenticationHeader(headers);
            AddMandatoryRequestHeaders(headers);

            try
            {
                var dto = _mapper.Map<Models.Customers.RegisterCustomerDto.RegisterCustomerRequestDto>(request);
                _logger.LogInformation("Sending request to App.Customer - RegisterCustomer");

                var registerResponse = await _simpleHttpClient.PostAsync<RegisterCustomerResponseModel>(url, body: dto, customHeaders: headers);

                return registerResponse;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Code == HttpStatusCode.Conflict)
                {
                    return ReturnResponseWithErrorMessage("Customer already exists.", RegistrationErrorType.AlreadyExists);
                }

                return ReturnResponseWithErrorMessage("Http exception occurred.", RegistrationErrorType.HttpError);
            }
            catch (Exception ex)
            {
                return ReturnResponseWithErrorMessage("Internal error occurred while processing your request: " + ex.Message, RegistrationErrorType.InternalError);
            }
        }

        private static RegisterCustomerResponseModel ReturnResponseWithErrorMessage(string errorMessage, RegistrationErrorType errorType)
        {
            return new RegisterCustomerResponseModel()
            {
                IsError = true,
                ErrorDescription = errorMessage,
                ErrorType = errorType
            };
        }

        private async Task AddAuthenticationHeader(Dictionary<string, string> headers)
        {
            var token = await _tokenManagerService.GetTokenAsync(Scope);
            headers.Add(HeadersList.AuthorizationHeader, $"{HeadersList.BearerTokenHeader} {token}");
        }

        private static void AddMandatoryRequestHeaders(IDictionary<string, string> headers)
        {
            headers.Add(HeadersList.SiteHeader, "US");
            headers.Add(HeadersList.TraceIdHeader, Guid.NewGuid().ToString());
            headers.Add(HeadersList.ConsumerHeader, "UI.Account");
            headers.Add(HeadersList.AcceptLanguageHeader, "en-US");
        }
    }
}