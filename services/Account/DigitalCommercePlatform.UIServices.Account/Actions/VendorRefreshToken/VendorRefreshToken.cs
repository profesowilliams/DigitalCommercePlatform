using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models.Vendors;
using DigitalCommercePlatform.UIServices.Account.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.VendorRefreshToken
{
    [ExcludeFromCodeCoverage]
    public class VendorRefreshToken
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
                var vendorRefresh = await _vendorService.VendorRefreshToken(request);
                return new ResponseBase<Response> { Content = vendorRefresh };
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Vendor).Must(IsValidVendorName).WithMessage("Invalid 'vendor' name");
            }

            private bool IsValidVendorName(string vendor)
            {
                return vendor != null && VendorService.GetAllowedVendorValues().Contains(vendor.ToLower());
            }
        }
    }
}
