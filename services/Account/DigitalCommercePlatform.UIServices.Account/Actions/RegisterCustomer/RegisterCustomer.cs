//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Features.Cache;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using MediatR;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.RegisterCustomer
{
    [ExcludeFromCodeCoverage]
    public sealed class RegisterCustomer
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public RegisterCustomerRequestModel RegistrationRequest { get; set; }

            public Request(RegisterCustomerRequestModel request)
            {
                RegistrationRequest = request;
            }
        }

        public class Response
        {
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;
            private readonly IMapper _mapper;
            private readonly ICustomerService _customerService;

            public Handler(ISessionIdBasedCacheProvider sessionIdBasedCacheProvider, IMapper mapper, ICustomerService customerService)
            {
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider;
                _mapper = mapper;
                _customerService = customerService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var serviceResponse = await _customerService.RegisterCustomerAsync(request, cancellationToken);
                return serviceResponse;
            }
        }
    }
}