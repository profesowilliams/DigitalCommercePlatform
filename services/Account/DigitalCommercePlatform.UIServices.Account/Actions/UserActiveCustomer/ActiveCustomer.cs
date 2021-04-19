using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalFoundation.Common.Cache.UI;
using FluentValidation;
using MediatR;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.UserActiveCustomer
{
    [ExcludeFromCodeCoverage]
    public sealed class ActiveCustomer
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string CompanyNumber { get; init; }
            public string CompanyName { get; init; }
        }

        public class Response
        {
            public string Message { get; set; }
        }

        public class RequestValidator : AbstractValidator<Request>
        {
            public RequestValidator(ISessionIdBasedCacheProvider sessionIdBasedCacheProvider)
            {
                RuleFor(p => p.CompanyNumber).NotEmpty().WithMessage("CompanyNumber is required.");
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
                var customer = new Customer { Name = request.CompanyName, Number = request.CompanyNumber };
                _sessionIdBasedCacheProvider.Put(userFromCache.ID, customer, 86400);

                return await Task.FromResult(new ResponseBase<Response> { Content = new Response { Message = "Active customer stored" } });
            }
        }
    }
}
