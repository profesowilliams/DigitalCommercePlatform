using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.ConnectToVendor
{
    [ExcludeFromCodeCoverage]
    public sealed class SetVendorConnection
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Code { get; set; }
            public string Vendor { get; set; }
            public string RedirectURL { get; set; }
        }

        public class Response
        {
            public bool Items { get; set; }
        }
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IVendorService _vendorService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IVendorService vendorService, IMapper mapper, ILogger<Handler> logger  )
            {
                _vendorService = vendorService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                    var isConnected = await _vendorService.SetVendorConnection(request);
                    var response = _mapper.Map<Response>(isConnected);
                    return new ResponseBase<Response> { Content = response };
            }
        }
    }
}
