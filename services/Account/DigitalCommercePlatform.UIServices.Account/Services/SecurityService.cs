using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Security.Messages;
using DigitalFoundation.Common.Security.SecurityServiceClient;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    [ExcludeFromCodeCoverage]
    public class SecurityService : ISecurityService
    {
        private readonly string _coreSecurityUrl;
        private readonly IUIContext _context;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly IMapper _mapper;

        public SecurityService(IOptions<AppSettings> appSettingsOptions, IUIContext context, IMiddleTierHttpClient middleTierHttpClient, IMapper mapper)
        {
            if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }
            _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(Globals.CoreSecurityUrl) ?? 
                                                        throw new InvalidOperationException($"{Globals.CoreSecurityUrl} is missing from AppSettings");

            _context = context ?? throw new ArgumentNullException(nameof(context));
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<string> GetToken(string code, string redirectUri, string traceId, string language, string consumer)
        {
            var clientLoginCodeTokenRequest = new ClientLoginCodeTokenRequestModel()
            {
                Address = _coreSecurityUrl,
                ClientId = "ecom.apps.web.aem.dit",
                ClientSecret = "mVzaL03EDRQCVqooXHxpdzhwFEa8XBKCfPToPT8WdAE4wh6QTc21RVZYOKPS0JTW",
                Code = code,
                RedirectUri = new Uri(redirectUri)
            };

            _context.SetTraceId(traceId);
            _context.SetLanguage(language);
            _context.SetConsumer(consumer);

            var tokenResponseDto = await _middleTierHttpClient.GetLoginCodeTokenAsync(clientLoginCodeTokenRequest);
            return tokenResponseDto?.AccessToken;
        }

        public async Task<User> GetUser(string accessToken,string applicationName)
        {
            _context.SetAccessToken(accessToken);

            var userResponseDto = await _middleTierHttpClient.ValidateUserAsync(new ValidateUserRequestModel
            {
                Address = _coreSecurityUrl,
                ApplicationName = applicationName
            });

            var user = _mapper.Map<User>(userResponseDto?.User);

            return user;
        }
    }
}
