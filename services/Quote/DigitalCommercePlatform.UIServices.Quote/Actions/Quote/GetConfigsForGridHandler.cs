using AutoMapper;
using DigitalFoundation.Common.Client;
using MediatR;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.IO;

namespace DigitalCommercePlatform.UIServices.Quote.Actions.Quote
{
    public class GetConfigsForGridRequest : IRequest<GetConfigsForGridResponse>
    {
        public string Creator { get; }
        public string AccessToken { get; }

        public GetConfigsForGridRequest(string creator, string accessToken)
        {
            Creator = creator;
            AccessToken = accessToken;
        }
    }

    public class GetConfigsForGridResponse
    {
        public string Content { get; }

        public virtual bool IsError { get; set; }
        public string ErrorCode { get; set; }

        public GetConfigsForGridResponse(string json)
        {
            Content = json;
        }
    }

    public class GetConfigsForGridHandler : IRequestHandler<GetConfigsForGridRequest, GetConfigsForGridResponse>
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public GetConfigsForGridHandler(IHttpClientFactory httpClientFactory) //IMiddleTierHttpClient middleTierHttpClient, IMapper mapper)
        {
            if (httpClientFactory == null) { throw new ArgumentNullException(nameof(httpClientFactory)); }

            _httpClientFactory = httpClientFactory;
        }

        public async Task<GetConfigsForGridResponse> Handle(GetConfigsForGridRequest request, CancellationToken cancellationToken)
        {
            string dir = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string filename = dir + @"\Demo\Configs.json";
            using (var reader = File.OpenText(filename))
            {
                var fileContent = await reader.ReadToEndAsync();
                var result = new GetConfigsForGridResponse(fileContent);
                return result;
            }
        }
    }
}