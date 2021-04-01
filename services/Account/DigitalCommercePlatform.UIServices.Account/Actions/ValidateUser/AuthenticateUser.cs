using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Cache.UI;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using FluentValidation;
using MediatR;
using System;
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



            public AuthenticateUserQueryHandler(ISecurityService securityService, ISessionIdBasedCacheProvider sessionIdBasedCacheProvider, IMapper mapper)
            {
                _securityService = securityService ?? throw new ArgumentNullException(nameof(securityService));
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider ?? throw new ArgumentNullException(nameof(sessionIdBasedCacheProvider));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var tokenResponse = await _securityService.GetToken(request.Code, request.RedirectUri, request.TraceId, request.Language, request.Consumer);

                if (string.IsNullOrEmpty(tokenResponse.AccessToken))
                {
                    return new ResponseBase<Response>
                    {
                        Error = new ErrorInformation
                        {
                            IsError = true,
                            Message = tokenResponse.Exception.Message,
                            Code = tokenResponse.Exception is RemoteServerHttpException remoteTokenException ? (int)remoteTokenException.Code : 11111 // we should agree about code
                        }
                    };
                }
                

                var userResponse = await _securityService.GetUser(tokenResponse.AccessToken, request.ApplicationName, request.TraceId, request.Language, request.Consumer);

                if (userResponse.User == null)
                {
                    return new ResponseBase<Response>
                    {
                        Error = new ErrorInformation
                        {
                            IsError = true,
                            Message = userResponse.Exception.Message,
                            Code = userResponse.Exception is RemoteServerHttpException remoteUserException ? (int)remoteUserException.Code : 11111 // we should agree about code
                        }
                    };
                }

                _sessionIdBasedCacheProvider.Put("User", userResponse.User, 86400);

                var userDto = _mapper.Map<User>(userResponse.User);

                var response = new ResponseBase<Response> { Content = new Response { User = userDto } };
                return response;
            }
        }
    }
}