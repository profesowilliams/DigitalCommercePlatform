//using DigitalCommercePlatform.UIServices.Security.DTO.Response;
//using DigitalCommercePlatform.UIServices.Security.Infrastructure;
//using DigitalFoundation.Common.Extensions;
//using DigitalFoundation.Common.Settings;
//using FluentValidation;
//using Flurl;
//using MediatR;
//using Microsoft.Extensions.Caching.Distributed;
//using Microsoft.Extensions.Logging;
//using Microsoft.Extensions.Options;
//using Newtonsoft.Json;
//using System;
//using System.Net.Http;
//using System.Threading;
//using System.Threading.Tasks;

//namespace DigitalCommercePlatform.UIServices.Security.Actions
//{
//    public class GetUserQuery : IRequest<GetUserResponse>
//    {
//        public string ApplicationName { get; }
//        public string SessionId { get; }


//        public GetUserQuery(string applicationName,string sessionId)
//        {
//            ApplicationName = applicationName;
//            SessionId = sessionId;
//        }
//    }

//    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, GetUserResponse>
//    {
//        private readonly ILogger<GetUserQueryHandler> _logger;
//        private readonly IHttpClientFactory _clientFactory;
//        private readonly string _coreSecurityUrl;
//        private readonly string _coreSecurityValidateEndpointUrl;
//        private readonly IDistributedCache _cache;


//        public GetUserQueryHandler(IDistributedCache cache,ILogger<GetUserQueryHandler> logger, IOptions<AppSettings> appSettingsOptions
//                                    ,IOptions<CoreSecurityEndpointsOptions> coreSecurityEndpointsOptions, IHttpClientFactory clientFactory)
//        {
//            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
//            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
//            if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }
//            if (coreSecurityEndpointsOptions == null) { throw new ArgumentNullException(nameof(coreSecurityEndpointsOptions)); }
//            _clientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));

//            const string appSettingsNameForCoreSecurityUrl = "Core.Security.Url";
//            _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(appSettingsNameForCoreSecurityUrl) ?? throw new InvalidOperationException($"{appSettingsNameForCoreSecurityUrl} is missing from AppSettings");
//            _coreSecurityValidateEndpointUrl = coreSecurityEndpointsOptions.Value?.Validate ?? throw new InvalidOperationException("Validate key/value is missing from AppSettings");
//        }

//        public async Task<GetUserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
//        {
//            //var options = new DistributedCacheEntryOptions
//            //{
//            //    AbsoluteExpiration = DateTime.Now.AddMinutes(3)
//            //};

//            //await _cache.SetStringAsync("testkey01", JsonConvert.SerializeObject(new { Name = "developer" }), options);

//            //var value = await _cache.GetStringAsync("testkey01");


//            //var requestUrl = _coreSecurityUrl.AppendPathSegment(_coreSecurityValidateEndpointUrl).AppendPathSegment(request?.ApplicationName);

//            //var requestMessage = new HttpRequestMessage(HttpMethod.Get, requestUrl); // "https://eastus-dit-service.dc.tdebusiness.cloud/core-security/v1/validate/a"
//            //var client = _clientFactory.CreateClient("CoreSecurityClient");
//            //var response = await client.SendAsync(requestMessage, cancellationToken).ConfigureAwait(false);
//            //var validateUserResponse = await response.Content.ReadAsAsync<GetUserResponse>().ConfigureAwait(false);
//            //validateUserResponse.HttpStatusCode = response.StatusCode;
//            //return validateUserResponse;
//            return new GetUserResponse();
//        }
//    }
//}