using DigitalCommercePlatform.UIService.Customer.Actions.Abstracts;
using DigitalCommercePlatform.UIService.Customer.Models.Customer;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
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
    public sealed class CustomerFind
    {
        public class Request : RequestBase, IRequest<Response>
        {
            public int CustomerNumber { get; set; }
            public string CustomerName { get; set; }
            public string StreetAddress1 { get; set; }
            public string StreetAddress2 { get; set; }
            public string City { get; set; }
            public string Region { get; set; }
            public string PostalCode { get; set; }
            public string PhoneNumber { get; set; }
            public string SalesTeamID { get; set; }
            public string SalesTeamName { get; set; }
            public string SystemId { get; set; }
            public string SalesOrganization { get; set; }
            public string CustomerGroupCode { get; set; }

            public int Page { get; set; }
            public int PageSize { get; set; }
            public int Sort { get; set; }

            public bool SortAscending { get; set; }
            public bool Count { get; set; }

            public Request() : base() { }
        }

        public class Response : ResponseBase<IEnumerable<CustomerModel>>
        {
            public Response(IEnumerable<CustomerModel> model) : base(model) { }
        }

        public class Handler : HandlerBase<CustomerFind>, IRequestHandler<Request, Response>
        {
            private const string _appServiceFindCustomerUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-customer/v1/find";

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
                    Logger.LogInformation($"UIService.CustomerFind");
                    var url = _appServiceFindCustomerUrl.BuildQuery(request);
                    var uri = url.ToUri();
                    var data = await GetAsync<IEnumerable<CustomerModel>>(uri, request.AccessToken, cancellationToken);
                    //var models = await _client.GetAsync<IEnumerable<CustomerModel>>(url).ConfigureAwait(false);
                    return new Response(data);
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex, "Exception at: " + nameof(CustomerFind));
                    throw;
                }
            }
        }

        public class Validator : ValidatorBase<Request>
        {
            public Validator()
            {

            }
        }
    }
}
