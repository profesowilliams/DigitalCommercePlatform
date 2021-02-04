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
    public class GetRenewalsForGridRequest : IRequest<GetRenewalsForGridResponse>
    {
        public string Creator { get; }
        public string AccessToken { get; }

        public GetRenewalsForGridRequest(string creator, string accessToken)
        {
            Creator = creator;
            AccessToken = accessToken;
        }
    }

    public class GetRenewalsForGridResponse
    {
        public string Content { get; }

        public virtual bool IsError { get; set; }
        public string ErrorCode { get; set; }

        public GetRenewalsForGridResponse(string json)
        {
            Content = json;
        }
    }

    public class GetRenewalsForGridHandler : IRequestHandler<GetRenewalsForGridRequest, GetRenewalsForGridResponse>
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public GetRenewalsForGridHandler(IHttpClientFactory httpClientFactory) //IMiddleTierHttpClient middleTierHttpClient, IMapper mapper)
        {
            if (httpClientFactory == null) { throw new ArgumentNullException(nameof(httpClientFactory)); }

            _httpClientFactory = httpClientFactory;
        }

        public async Task<GetRenewalsForGridResponse> Handle(GetRenewalsForGridRequest request, CancellationToken cancellationToken)
        {
            string dir = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string filename = dir + @"\Data\Renewals.json";
            using (var reader = File.OpenText(filename))
            {
                var fileContent = await reader.ReadToEndAsync();
                var result = new GetRenewalsForGridResponse(fileContent);
                return result;
            }
        }
    }
}