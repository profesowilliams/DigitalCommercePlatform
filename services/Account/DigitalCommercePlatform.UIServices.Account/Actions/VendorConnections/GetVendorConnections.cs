using DigitalCommercePlatform.UIServices.Account.Models.Vendors;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using MediatR;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.VendorConnections
{
    [ExcludeFromCodeCoverage]
    public class GetVendorConnections
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
        }

        public class Response
        {
            public List<VendorConnection> Items { get; set; }
        }

        public class GetVendorConnectionsHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IVendorService _vendorService;

            public GetVendorConnectionsHandler(IVendorService vendorService)
            {
                _vendorService = vendorService ?? throw new ArgumentNullException(nameof(vendorService));
            }

            public Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var vendorConnections = _vendorService.GetVendorConnectionsAsync();

                var response = new ResponseBase<Response> { Content = new Response { Items = vendorConnections.Result } };
                return Task.FromResult(response);
            }
        }
    }
}