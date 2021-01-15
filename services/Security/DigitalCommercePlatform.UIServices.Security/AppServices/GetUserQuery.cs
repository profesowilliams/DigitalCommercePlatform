using DigitalCommercePlatform.UIServices.Security.Models;
using DigitalCommercePlatform.UIServices.Security.Responses;
using DigitalCommercePlatform.UIServices.Security.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.AppServices
{
    public class GetUserQueryValidator : AbstractValidator<GetUserQuery>
    {
        public GetUserQueryValidator()
        {
            RuleFor(p => p.SessionId).NotEmpty().WithMessage("{PropertyName} is required.")
                .MaximumLength(10).WithMessage("{PropertyName} must not exceed 10 characters."); 
            // just example
        }
    }




    public class GetUserQuery : IRequest<UserResponse>
    {
        public string ApplicationName { get; }
        public string SessionId { get; }

        public GetUserQuery(string applicationName, string sessionId)
        {
            ApplicationName = applicationName;
            SessionId = sessionId;
        }
    }

    public class GetUserAndTokenQueryHandler : IRequestHandler<GetUserQuery, UserResponse>
    {
        private readonly IUserService _userService;


        private readonly ILogger<GetUserAndTokenQueryHandler> _logger;
        private readonly IDistributedCache _cache;



        public GetUserAndTokenQueryHandler(IDistributedCache cache, ILogger<GetUserAndTokenQueryHandler> logger, IUserService userService)
        {
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        public async Task<UserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var validator = new GetUserQueryValidator();
            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count > 0)
                throw new Exception("test , should be specific exception");




            var userAndTokenCacheEntry = await _cache.GetStringAsync(request?.SessionId, token: cancellationToken).ConfigureAwait(false);

            return new UserResponse { User = new User { FirstName = "Test" } };



            /*
            var userAndTokenCacheEntry = await _cache.GetStringAsync(request?.SessionId, token: cancellationToken).ConfigureAwait(false);

            if (userAndTokenCacheEntry == null)
            {
                return new UserResponse { User = null, HttpStatusCode = System.Net.HttpStatusCode.NotFound };
            }

            var userAndToken =  JsonConvert.DeserializeObject<UserAndToken>(userAndTokenCacheEntry);

            var tokenExpirationDateTime = DateTime.UtcNow + TimeSpan.FromSeconds(userAndToken.Token.expires_in);

            if (tokenExpirationDateTime > DateTime.UtcNow)
            {
                return new UserResponse { User = userAndToken.User, HttpStatusCode = System.Net.HttpStatusCode.OK };
            }

            // for the               userAndToken.Token.refresh_token
            // get new token from core-security
            //for the new token call core security validate user 


            var coreUserDto = await _userService.GetUserAsync(request?.ApplicationName, userAndToken.Token.access_token);

            //

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpiration = DateTime.UtcNow + TimeSpan.FromDays(1)
            };

            var credentials = new UserAndToken
            {
                Token = new Token(),
                User = coreUserDto.User
            };

            await _cache.SetStringAsync("71000", JsonConvert.SerializeObject(credentials), options, token: cancellationToken).ConfigureAwait(false);

            //



            return new UserResponse
            {
                 User = coreUserDto.User,
                 HttpStatusCode = (System.Net.HttpStatusCode) coreUserDto.StatusCode
            };

            throw new Exception("aaaa");
    */

            //throw new Exception("aaaa");


            //var t = request.SessionId.Trim();


            //return new UserResponse { User = new User { FirstName = "Vlade Divac" } };
        }
    }
}
