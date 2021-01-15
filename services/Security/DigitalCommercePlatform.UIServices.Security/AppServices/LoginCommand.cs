using DigitalCommercePlatform.UIServices.Security.Models;
using DigitalCommercePlatform.UIServices.Security.Responses;
using DigitalCommercePlatform.UIServices.Security.Services;
using DigitalFoundation.Common.Extensions;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.AppServices
{
    public class LoginCommand : IRequest<GetTokenResponse>
    {
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        public LoginCommand(string code, string returnUrl)
        {
            Code = code;
            ReturnUrl = returnUrl;
        }
    }

    public class GetTokenQueryHandler : IRequestHandler<LoginCommand, GetTokenResponse>
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IDistributedCache _cache;
        private readonly IUserService _userService;


        public GetTokenQueryHandler(IDistributedCache cache, IHttpClientFactory clientFactory, IUserService userService)
        {
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _clientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));
            _userService = userService;
        }

        public async Task<GetTokenResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var client = _clientFactory.CreateClient("GetTokenClient");
            var requestMsg = new HttpRequestMessage(new HttpMethod("POST"), "https://sso.cstenet.com/as/token.oauth2");

            var contentList = new List<string>();
            contentList.Add($"grant_type={Uri.EscapeDataString("password")}");
            contentList.Add($"username={Uri.EscapeDataString("531517")}");
            contentList.Add($"password={Uri.EscapeDataString("")}");
            contentList.Add($"client_id={Uri.EscapeDataString("xml_service_client")}");
            contentList.Add($"client_secret={Uri.EscapeDataString("")}");
            contentList.Add($"validator_id={Uri.EscapeDataString("ShieldUidCredentialValidator")}");
            requestMsg.Content = new StringContent(string.Join("&", contentList));
            requestMsg.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-www-form-urlencoded");

            var response = await client.SendAsync(requestMsg);


            var content = await response.Content.ReadAsStringAsync();
            var tokenData = JsonConvert.DeserializeObject<Token>(content);


            //

            var test = await _userService.GetUserAsync("aem", tokenData.access_token);

            var gzrequestUrl = "http://core-security/v1/validate/aem";

            var gzrequestMessage = new HttpRequestMessage(HttpMethod.Get, gzrequestUrl); // "https://eastus-dit-service.dc.tdebusiness.cloud/core-security/v1/validate/a"
            var gzcoreClient = _clientFactory.CreateClient("CoreSecurityClient");

            gzcoreClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenData.access_token);


            var gzresponsecore = await gzcoreClient.SendAsync(gzrequestMessage, cancellationToken).ConfigureAwait(false);
            var coreUserDto = await gzresponsecore.Content.ReadAsAsync<CoreUserDto>().ConfigureAwait(false);

            //


            // store to redis

            //var expirationTime = DateTime.UtcNow + TimeSpan.FromSeconds(tokenData.expires_in);

            //var gz = expirationTime.ToString("o", CultureInfo.InvariantCulture);

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpiration = DateTime.UtcNow + TimeSpan.FromDays(1)
            };

            var credentials = new UserAndToken
            {
                Token = tokenData,
                User = coreUserDto.User
            };

            await _cache.SetStringAsync("71000", JsonConvert.SerializeObject(credentials), options, token: cancellationToken).ConfigureAwait(false);


            // store to redis



            return new GetTokenResponse
            {
                access_token = tokenData.access_token
            };
        }
    }
}
