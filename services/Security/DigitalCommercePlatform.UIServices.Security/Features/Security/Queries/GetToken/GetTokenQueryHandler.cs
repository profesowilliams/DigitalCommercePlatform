using MediatR;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetToken
{
    [ExcludeFromCodeCoverage]

    public class GetTokenQueryHandler : IRequestHandler<GetTokenQuery, GetTokenResponse>
    {
        //private readonly IMiddleTierHttpClient _middleTierHttpClient;
        //private readonly IMapper _mapper;
        //private readonly IDistributedCache _cache;
        //private readonly string _coreSecurityUrl;
        //private readonly string _clientId;
        //private readonly string _clientSecret;

        //public GetTokenQueryHandler(IOptions<AppSettings> appSettingsOptions, IOptions<OAuthClientDetailsOptions> oauthClientDetailsOptions,
        //                                                IMiddleTierHttpClient middleTierHttpClient, IMapper mapper, IDistributedCache cache)
        //{
        //    if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }
        //    if (oauthClientDetailsOptions == null) { throw new ArgumentNullException(nameof(oauthClientDetailsOptions)); }

        //    _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(Globals.CoreSecurityUrl) ?? throw new InvalidOperationException($"{Globals.CoreSecurityUrl} is missing from AppSettings");
        //    _clientId = oauthClientDetailsOptions.Value?.ClientId ?? throw new InvalidOperationException("ClientId key/value is missing from AppSettings");
        //    _clientSecret = oauthClientDetailsOptions.Value?.ClientSecret ?? throw new InvalidOperationException("ClientSecret key/value is missing from AppSettings");

        //    _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
        //    _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        //    _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        //}

        public async Task<GetTokenResponse> Handle(GetTokenQuery request, CancellationToken cancellationToken)
        {
            //var clientLoginCodeTokenRequest = new ClientLoginCodeTokenRequestModel()
            //{
            //    Address = _coreSecurityUrl,
            //    ClientId = _clientId,
            //    ClientSecret = _clientSecret,
            //    Code = request?.Code,
            //    RedirectUri = new Uri(request?.RedirectUri)
            //};

            //var tokenDto = await _middleTierHttpClient.GetLoginCodeTokenAsync(clientLoginCodeTokenRequest);

            //if (!string.IsNullOrEmpty(tokenDto?.AccessToken))
            //{
            //    var options = new DistributedCacheEntryOptions
            //    {
            //        AbsoluteExpiration = DateTime.UtcNow + TimeSpan.FromSeconds(tokenDto.ExpiresIn)
            //    };

            //    await _cache.SetStringAsync(request?.SessionId, tokenDto.AccessToken, options, token: cancellationToken);
            //}

            //var tokenResponse = _mapper.Map<GetTokenResponse>(tokenDto);
            //return tokenResponse;

            if (!request.WithUserData.HasValue || !request.WithUserData.Value)
            {
                return await Task.FromResult(new GetTokenResponse() { Message = "Login successful" });
            }

            var tokenResponse = new GetTokenResponse
            {
                Message = "Login successful",
                User = new Models.User
                {
                    ID = "531517",
                    FirstName = "RODNEY",
                    LastName = "GICKER",
                    Name = "RODNEY GICKER",
                    Email = "RODNEY.GICKER@TECHDATA.COM",
                    Phone = "727-539-7429",
                    Customers = new List<string>()
                    {
                        "0038048612",
                        "0038066560",
                        "0038066556",
                        "0038054253"
                    },
                    Roles = new List<string>()
                    {
                        "Administrator",
                        "Customer Service Representative",
                        "Marketer",
                        "Website owner"
                    }
                }
            };

            return await Task.FromResult(tokenResponse);
        }
    }
}
