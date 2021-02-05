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
    public class GetTdQuotesForGridRequest : IRequest<GetTdQuotesForGridResponse>
    {
        public string Creator { get; }
        public string AccessToken { get; }

        public GetTdQuotesForGridRequest(string creator, string accessToken)
        {
            Creator = creator;
            AccessToken = accessToken;
        }
    }

    public class GetTdQuotesForGridResponse
    {
        public string Content { get; }

        public virtual bool IsError { get; set; }
        public string ErrorCode { get; set; }

        public GetTdQuotesForGridResponse(string json)
        {
            Content = json;
        }
    }

    public class GetTdQuotesForGridHandler : IRequestHandler<GetTdQuotesForGridRequest, GetTdQuotesForGridResponse>
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public GetTdQuotesForGridHandler(IHttpClientFactory httpClientFactory) //IMiddleTierHttpClient middleTierHttpClient, IMapper mapper)
        {
            if (httpClientFactory == null) { throw new ArgumentNullException(nameof(httpClientFactory)); }

            _httpClientFactory = httpClientFactory;
        }

        public async Task<GetTdQuotesForGridResponse> Handle(GetTdQuotesForGridRequest request, CancellationToken cancellationToken)
        {
            string dir = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string filename = dir + @"\Demo\TDQuotes.json";
            using (var reader = File.OpenText(filename))
            {
                var fileContent = await reader.ReadToEndAsync();
                var result = new GetTdQuotesForGridResponse(fileContent);
                return result;
            }
        }
    }
}