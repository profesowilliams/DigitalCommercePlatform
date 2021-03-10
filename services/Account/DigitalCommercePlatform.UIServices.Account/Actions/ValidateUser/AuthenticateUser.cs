using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Infrastructure;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalFoundation.Common.Cache.UI;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Security.Messages;
using DigitalFoundation.Common.Security.SecurityServiceClient;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser
{
    [ExcludeFromCodeCoverage]
    public sealed class AuthenticateUser
    {
        public class Request : IRequest<Response>
        {
            public string Code { get; }
            public string RedirectUri { get; }
            public string ApplicationName { get; set; }
            public string TraceId { get; }
            public string Language { get; }
            public string Consumer { get; }
            public string SessionId { get; }

            public Request(string code, string redirectUri, string applicationName, string traceId, string language, string consumer, string sessionId)
            {
                Code = code;
                RedirectUri = redirectUri;
                TraceId = traceId;
                Language = language;
                Consumer = consumer;
                SessionId = sessionId;
                ApplicationName = applicationName;
            }
        }

        public class Response
        {
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
            public string IdentityToken { get; set; }
            public string TokenType { get; set; }
            public int ExpiresIn { get; set; }
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }
            public SecurityResponseErrorType ErrorType { get; set; }
            public string ErrorDescription { get; set; }
            public string Message { get; set; }
            public User User { get; set; }
        }

        public class RequestValidator : AbstractValidator<Request>
        {
            public RequestValidator()
            {
                RuleFor(p => p.Code).NotEmpty().WithMessage("Code is required.");
                RuleFor(p => p.RedirectUri).NotEmpty().WithMessage("RedirectUri is required.");
                RuleFor(p => p.TraceId).NotEmpty().WithMessage("TraceId is required.");
                RuleFor(p => p.Language).NotEmpty().WithMessage("Language is required.");
                RuleFor(p => p.Consumer).NotEmpty().WithMessage("Consumer is required.");
                RuleFor(p => p.SessionId).NotEmpty().WithMessage("SessionId is required.");
                RuleFor(p => p.ApplicationName).NotEmpty().WithMessage("ApplicationName is required.");
            }
        }

        public class AuthenticateUserQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;
            private readonly IUIContext _context;
            private readonly IMiddleTierHttpClient _middleTierHttpClient;
            private readonly IMapper _mapper;
            private readonly string _coreSecurityUrl;
            private readonly string _clientId;
            private readonly string _clientSecret;

            public AuthenticateUserQueryHandler(IUIContext context, ISessionIdBasedCacheProvider sessionIdBasedCacheProvider, IOptions<AppSettings> appSettingsOptions,
            IOptions<OAuthClientDetailsOptions> oauthClientDetailsOptions, IMiddleTierHttpClient middleTierHttpClient, IMapper mapper)
            {
                if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }
                if (oauthClientDetailsOptions == null) { throw new ArgumentNullException(nameof(oauthClientDetailsOptions)); }

                _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(Globals.CoreSecurityUrl) ?? throw new InvalidOperationException($"{Globals.CoreSecurityUrl} is missing from AppSettings");
                _clientId = oauthClientDetailsOptions.Value?.ClientId ?? throw new InvalidOperationException("ClientId key/value is missing from AppSettings");
                _clientSecret = oauthClientDetailsOptions.Value?.ClientSecret ?? throw new InvalidOperationException("ClientSecret key/value is missing from AppSettings");

                _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider;
                _context = context;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var clientLoginCodeTokenRequest = new ClientLoginCodeTokenRequestModel()
                {
                    Address = _coreSecurityUrl,
                    ClientId = _clientId,
                    ClientSecret = _clientSecret,
                    Code = request?.Code,
                    RedirectUri = new Uri(request?.RedirectUri)
                };

                _context.SetTraceId(request?.TraceId);
                _context.SetLanguage(request?.Language);
                _context.SetConsumer(request?.Consumer);

                var tokenResponseDto = await _middleTierHttpClient.GetLoginCodeTokenAsync(clientLoginCodeTokenRequest);

                if (!string.IsNullOrEmpty(tokenResponseDto?.AccessToken))
                {
                    _context.SetAccessToken(tokenResponseDto?.AccessToken);

                    var user = await _middleTierHttpClient.ValidateUserAsync(new ValidateUserRequestModel
                    {
                        Address = _coreSecurityUrl,
                        ApplicationName = request?.ApplicationName
                    });

                    _sessionIdBasedCacheProvider.Put("User", user?.User);
                }

                var tokenResponse = _mapper.Map<Response>(tokenResponseDto);
                return tokenResponse;
            }
        }
    }
}