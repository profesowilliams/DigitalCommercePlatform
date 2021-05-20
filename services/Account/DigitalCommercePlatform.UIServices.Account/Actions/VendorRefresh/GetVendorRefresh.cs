using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.VendorRefresh
{
    [ExcludeFromCodeCoverage]
    public class GetVendorRefresh
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Vendor { get; set; }

            public Request(string vendor)
            {
                Vendor = vendor;
            }
        }

        public class Response
        {
            public bool IsSuccess { get; set; }
        }
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IAccountService accountService, IMapper mapper, ILogger<Handler> logger)
            {
                _accountService = accountService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var vendorRefresh = await _accountService.VendorRefresh(request);
                return new ResponseBase<Response> { Content = vendorRefresh };
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Vendor).NotNull();
            }
        }
    }
}
