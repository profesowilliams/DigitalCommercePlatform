//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.Refresh
{
    public sealed class RefreshData
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string VendorName { get; set; }
            public string Type { get; set; }
            public string Version { get; set; }
        }

        public class Response
        {
            public bool Refreshed { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            protected readonly IVendorService _vendorService;

            public Handler(IVendorService vendorService)
            {
                _vendorService = vendorService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var data = await _vendorService.RefreshVendor(request).ConfigureAwait(false);
                var response = new Response
                {
                    Refreshed = data.Refreshed,
                };

                return new ResponseBase<Response> { Content = response };
            }
        }
    }
}
