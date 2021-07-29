using DigitalFoundation.Common.Cache.UI;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.UserActiveCustomer
{
    [ExcludeFromCodeCoverage]
    public sealed class ActiveCustomer
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string CustomerNumber { get; init; }
        }

        public class Response
        {
            public string Message { get; set; }
        }

        public class RequestValidator : AbstractValidator<Request>
        {
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;

            public RequestValidator(ISessionIdBasedCacheProvider sessionIdBasedCacheProvider)
            {
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider ?? throw new ArgumentNullException(nameof(sessionIdBasedCacheProvider));

                RuleFor(p => p.CustomerNumber).NotEmpty().WithMessage("CustomerNumber is required.");
                RuleFor(i => i.CustomerNumber).Must(IsCustomerNumberValid).WithMessage(i => $"Customer number : {i.CustomerNumber} is not valid customer number for this user");
            }

            private bool IsCustomerNumberValid(string customerNumber)
            {
                var userFromCache = _sessionIdBasedCacheProvider.Get<DigitalFoundation.Common.Models.User>("User");
                bool isCustomerNumberValid = userFromCache.CustomerList.Any(i => i.CustomerNumber == customerNumber);
                return isCustomerNumberValid;
            }
        }

        public class UserActiveCustomerHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;

            public UserActiveCustomerHandler(ISessionIdBasedCacheProvider sessionIdBasedCacheProvider)
            {
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider ?? throw new ArgumentNullException(nameof(sessionIdBasedCacheProvider));
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var userFromCache = _sessionIdBasedCacheProvider.Get<DigitalFoundation.Common.Models.User>("User");
                var customer = userFromCache.CustomerList.Where(i => i.CustomerNumber == request.CustomerNumber).SingleOrDefault();
                userFromCache.ActiveCustomer = customer;
                _sessionIdBasedCacheProvider.Remove("User");
                _sessionIdBasedCacheProvider.Put("User", userFromCache, 86400);

                return await Task.FromResult(new ResponseBase<Response> { Content = new Response { Message = "Active customer stored" } });
            }
        }
    }
}