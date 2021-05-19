using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models.Vendors;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.VendorReference
{
    [ExcludeFromCodeCoverage]
    public class GetVendorReference
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            
        }

        public class Response
        {
            public List<VendorReferenceModel> Items { get; set; }
        }
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IAccountService accountService, IMapper mapper, ILogger<Handler> logger  )
            {
                _accountService = accountService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                    var vendorReference = await _accountService.GetVendorReference();
                    var vendorMappedDeals = _mapper.Map<Response>(vendorReference);
                    return new ResponseBase<Response> { Content = vendorMappedDeals };
            }
        }
    }
}
