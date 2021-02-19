using DigitalCommercePlatform.UIService.Customer.Actions.Abstracts;
using DigitalCommercePlatform.UIService.Customer.Models.Config;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Customer.Actions
{
    [ExcludeFromCodeCoverage]
    public sealed class ConfigGet
    {
        public class Request : RequestBase, IRequest<Response>
        {
            public string SessionId { get; set; }
            public string SortBy { get; set; } //TODO: if null or empty  default will be created time
            public string SortDirection { get; set; } //TODO: if null or empty then descending

            public Request(string accessToken) : base(accessToken)
            {
            }
        }

        public class Response : ResponseBase<IEnumerable<ConfigModel>>
        {
            public string Action { get; set; } // TODO: if quote is not null or empty then “Update” else “Create Quote”
            public string SortBy { get; set; } // TODO: if null or empty  default will be “Created Time”
            public string SortDirection { get; set; } // TODO:  if null or empty then “Descending”  else “Ascending”
            public int PageSize { get; set; } // TODO: if null or empty then “10”  else “from client”
            public string CurrentPage { get; set; } // TODO: Default 1

            public Response(IEnumerable<ConfigModel> model) : base(model)
            {
            }
        }

        public class Handler : HandlerBase<ConfigGet>, IRequestHandler<Request, Response>
        {
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
                    string dir = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                    string filename = dir + @"\Models\_MockData\configs.json";
                    using var reader = File.OpenText(filename);
                    var configs = await reader.ReadToEndAsync();
                    var data = JsonConvert.DeserializeObject<IEnumerable<ConfigModel>>(configs);
                    return new Response(data);
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex, "Exception at: " + nameof(ConfigGet));
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
