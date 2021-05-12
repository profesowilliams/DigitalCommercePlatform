using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.ShipToAddress
{
    [ExcludeFromCodeCoverage]
    public class GetShipToAddress
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public Request()
            {
               
            }
        }
        public class Response
        {
            public IEnumerable<AddressDetails> Items { get; set; }
        }
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IAccountService accountServices,IMapper mapper,ILogger<Handler> logger)
            {
                _accountServices = accountServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var cartDetails = await _accountServices.GetShipToAdress(request);
                    var cartResponse = _mapper.Map<Response>(cartDetails);
                    return new ResponseBase<Response> { Content = cartResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting users saved cart(s) : " + nameof(GetShipToAddress));
                    throw;
                }
            }
        }
    }
}
