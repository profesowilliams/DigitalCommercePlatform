using DigitalCommercePlatform.UIServices.Customer.Actions.Abstracts;
using DigitalCommercePlatform.UIServices.Customer.Models.Customer;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Customer.Actions
{
    [ExcludeFromCodeCoverage]
    public sealed class CustomerGet
    {
        public class Request : RequestBase, IRequest<Response>
        {
            public string Id { get; private set; }

            public Request(string id, string accessToken) : base(accessToken)
            {
                Id = id;
            }
        }

        public class Response : ResponseBase<CustomerModel>
        {
            public Response(CustomerModel model) : base(model)
            {
            }
        }

        public class Handler : HandlerBase<CustomerGet>, IRequestHandler<Request, Response>
        {
            private const string _appServiceGetCustomerUrl = "https://eastus-sit-service.dc.tdebusiness.cloud/app-customer/v1";

            public Handler(IMiddleTierHttpClient client,
                           ILoggerFactory loggerFactory,
                           IOptions<AppSettings> options,
                           IHttpClientFactory httpClientFactory)
                : base(client, loggerFactory, options, httpClientFactory)
            {
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var url = $"{_appServiceGetCustomerUrl}/{request.Id}";
                    var data = await GetAsync<CustomerModel>(new Uri(url), request.AccessToken, cancellationToken);
                    return new Response(data);
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex, "Exception at: " + nameof(CustomerGet));
                    throw;
                }
            }
        }

        public class Validator : ValidatorBase<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Id).NotNull().NotEmpty().MinimumLength(2);
            }
        }
    }
}
