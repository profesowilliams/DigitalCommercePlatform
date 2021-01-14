//using DigitalCommercePlatform.UIServices.Security.DTO.Response;
//using MediatR;
//using Microsoft.Extensions.Caching.Distributed;
//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading;
//using System.Threading.Tasks;

//namespace DigitalCommercePlatform.UIServices.Security.Actions
//{
//    public class GetTokenQuery : IRequest<GetTokenResponse>
//    {
//        public string Code { get; set; }
//        public string ReturnUrl { get; set; }

//        public GetTokenQuery(string code, string returnUrl)
//        {
//            Code = code;
//            ReturnUrl = returnUrl;
//        }
//    }

//    public class GetTokenQueryHandler : IRequestHandler<GetTokenQuery, GetTokenResponse>
//    {
//        private readonly IHttpClientFactory _clientFactory;
//        private readonly IDistributedCache _cache;


//        public GetTokenQueryHandler(IDistributedCache cache, IHttpClientFactory clientFactory)
//        {
//            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
//            _clientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));
//        }

//        public async Task<GetTokenResponse> Handle(GetTokenQuery request, CancellationToken cancellationToken)
//        {
//            var client = _clientFactory.CreateClient("GetTokenClient");
//            var requestMsg = new HttpRequestMessage(new HttpMethod("POST"), "https://sso.cstenet.com/as/token.oauth2");

//            var contentList = new List<string>();
//            contentList.Add($"grant_type={Uri.EscapeDataString("password")}");
//            contentList.Add($"username={Uri.EscapeDataString("531517")}");
//            contentList.Add($"password={Uri.EscapeDataString("R0ds4evrpwd!1")}");
//            contentList.Add($"client_id={Uri.EscapeDataString("xml_service_client")}");
//            contentList.Add($"client_secret={Uri.EscapeDataString("vfmJUZ4gxkteoRH8nI6w7naysPw64cw6gOeg25Sc9V4KmzaLNm7A5lsGK5QtGdtG")}");
//            contentList.Add($"validator_id={Uri.EscapeDataString("ShieldUidCredentialValidator")}");
//            requestMsg.Content = new StringContent(string.Join("&", contentList));
//            requestMsg.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-www-form-urlencoded");

//            var response = await client.SendAsync(requestMsg);


//            var content = await response.Content.ReadAsStringAsync();
//            var tokenResponse = JsonConvert.DeserializeObject<GetTokenResponse>(content);



//            return tokenResponse;
//        }
//    }
//}
