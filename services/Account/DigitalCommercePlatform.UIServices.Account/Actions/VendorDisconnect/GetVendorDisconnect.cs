//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.VendorDisconnect
{
    [ExcludeFromCodeCoverage]
    public sealed class GetVendorDisconnect
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Vendor { get; set; }
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

            public Handler(IVendorService vendorService, IMapper mapper, ILogger<Handler> logger)
            {
                _vendorService = vendorService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var isConnected = await _vendorService.VendorDisconnect(request);
                var response = _mapper.Map<Response>(isConnected);
                return new ResponseBase<Response> { Content = response };
            }
        }
    }
}
