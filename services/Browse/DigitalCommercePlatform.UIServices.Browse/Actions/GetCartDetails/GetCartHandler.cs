using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails
{
    [ExcludeFromCodeCoverage]
    public static class GetCartHandler
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public Request(string userId, string customerId)
            {
                UserId = userId;
                CustomerId = customerId;
            }

            public string UserId { get; set; }
            public string CustomerId { get; set; }
        }

        public class Response
        {
            public string CartId { get; set; }
            public int CartItemCount { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IBrowseService _cartRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IBrowseService cartRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _cartRepositoryServices = cartRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var cartDetails = await _cartRepositoryServices.GetCartDetails(request);
                    var getcartResponse = _mapper.Map<Response>(cartDetails);
                    return new ResponseBase<Response> { Content=getcartResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Cart  : " + nameof(GetCartHandler));
                    throw ex;
                }
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.CustomerId).NotEmpty().WithMessage("Please enter CustomerId");
                RuleFor(i => i.UserId).NotEmpty().WithMessage("Please enter UserId");
            }
        }
    }
}