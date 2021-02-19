using DigitalCommercePlatform.UIService.Customer.Actions.Abstracts;
using DigitalCommercePlatform.UIService.Customer.Models.Customer;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Customer.Actions
{
    [ExcludeFromCodeCoverage]
    public sealed class CustomerGetById
    {
        public class Request : RequestBase, IRequest<Response>
        {
            public IEnumerable<string> Ids { get; set; }

            public Request(IEnumerable<string> ids, string accessToken) : base(accessToken)
            {
                Ids = ids;
            }
        }

        public class Response : ResponseBase<IEnumerable<CustomerModel>>
        {
            public Response(IEnumerable<CustomerModel> model) : base(model) { }
        }

        public class Handler : HandlerBase<CustomerGetById>, IRequestHandler<Request, Response>
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
                    Logger.LogInformation($"AppService.Customer.Id");
                    var url = _appServiceGetCustomerUrl.BuildQuery(request);
                    var uri = url.ToUri();
                    var data = await GetAsync<IEnumerable<CustomerModel>>(uri, request.AccessToken, cancellationToken);
                    return new Response(data);
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex, "Exception at: " + nameof(CustomerGetById));
                    throw;
                }
            }
        }

        public class Validator : ValidatorBase<Request>
        {
            public Validator()
            {
                RuleForEach(x => x.Ids)
                    .NotNull()
                    .MinimumLength(1);
            }
        }
    }
}
