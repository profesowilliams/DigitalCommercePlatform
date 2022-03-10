//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using MediatR;
using System;
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
            public DateTime? FromDate { get; set; }
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
                var data = _vendorService.RefreshVendor(request);
                var result = new Response
                {
                    Refreshed = data.Refreshed,
                };
                var response = new ResponseBase<Response> { Content = result };
                return await Task.FromResult(response);
            }
        }
    }
}
