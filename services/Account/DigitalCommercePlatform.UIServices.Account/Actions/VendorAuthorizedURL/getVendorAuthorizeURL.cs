//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.VendorAuthorizedURL
{
    public class getVendorAuthorizeURL
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
            public string URL { get; set; }
        }
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IVendorService _vendorService;
            private readonly IMapper _mapper;

            public Handler(IVendorService vendorService, IMapper mapper)
            {
                _vendorService = vendorService;
                _mapper = mapper;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {

                var isConnected = await _vendorService.VendorAutorizationURL(request);
                var response = _mapper.Map<Response>(isConnected);
                return new ResponseBase<Response> { Content = response };
            }
        }
    }
}
