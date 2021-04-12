using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Cache.UI;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser
{
    [ExcludeFromCodeCoverage]
    public sealed class AuthenticateUser
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Code { get; init; }
            public string RedirectUri { get; init; }
            public string ApplicationName { get; init; }
            public string TraceId { get; init; }
            public string Language { get; init; }
            public string Consumer { get; init; }
            public string SessionId { get; init; }
        }

        public class Response
        {
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

        public class AuthenticateUserQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ISecurityService _securityService;
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;
            private readonly IMapper _mapper;
            private readonly IUIContext _context;
            private readonly ILogger<AuthenticateUserQueryHandler> _logger;

            public AuthenticateUserQueryHandler(ISecurityService securityService, ISessionIdBasedCacheProvider sessionIdBasedCacheProvider, IMapper mapper, 
                                                    IUIContext context, ILogger<AuthenticateUserQueryHandler> logger)
            {
                _securityService = securityService ?? throw new ArgumentNullException(nameof(securityService));
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider ?? throw new ArgumentNullException(nameof(sessionIdBasedCacheProvider));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _context = context ?? throw new ArgumentNullException(nameof(context));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                _context.SetConsumer(request.Consumer);
                _context.SetLanguage(request.Language);
                _context.SetTraceId(request.TraceId);

                var tokenResponse = await _securityService.GetToken(request.Code, request.RedirectUri);

                if (string.IsNullOrEmpty(tokenResponse.AccessToken))
                {
                    _logger.LogInformation(tokenResponse.Exception, "No access token at: " + nameof(AuthenticateUserQueryHandler));

                    return new ResponseBase<Response>
                    {
                        Error = new ErrorInformation
                        {
                            IsError = true,
                            Messages = new List<string> { "Something went wrong" }, 
                            Code =tokenResponse.Exception is RemoteServerHttpException remoteTokenException ? (int)remoteTokenException.Code : 11111 
                            // we should agree about code and message
                        }
                    };
                }

                _context.SetAccessToken(tokenResponse.AccessToken);

                var userResponse = await _securityService.GetUser(request.ApplicationName);

                if (userResponse.User == null)
                {
                    _logger.LogInformation(userResponse.Exception, "No user at: " + nameof(AuthenticateUserQueryHandler));

                    return new ResponseBase<Response>
                    {
                        Error = new ErrorInformation
                        {
                            IsError = true,
                            Messages = new List<string> { "Something went wrong" },
                            Code = userResponse.Exception is RemoteServerHttpException remoteUserException ? (int)remoteUserException.Code : 11111 
                            // we should agree about code and message
                        }
                    };
                }

                userResponse.User.RefreshToken = tokenResponse.RefreshToken;

                _sessionIdBasedCacheProvider.Put("User", userResponse.User);

                var userDto = _mapper.Map<User>(userResponse.User);

                var response = new ResponseBase<Response> { Content = new Response { User = userDto } };
                return response;
            }
        }
    }
}