//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.CustomerAddress
{
    [ExcludeFromCodeCoverage]
    public class GetAddress
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Criteria { get; set; }
            public bool IgnoreSalesOrganization { get; set; }
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

            public Handler(IAccountService accountServices, IMapper mapper, ILogger<Handler> logger)
            {
                _accountServices = accountServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var cartDetails = await _accountServices.GetAddress(request);
                var cartResponse = _mapper.Map<Response>(cartDetails);
                return new ResponseBase<Response> { Content = cartResponse };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Criteria).NotNull();
            }
        }
    }
}
