using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Services;
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
        public class GetCartRequest : IRequest<ResponseBase<GetCartResponse>>
        {
            public GetCartRequest(string userId, string customerId)
            {
                UserId = userId;
                CustomerId = customerId;
            }

            public string UserId { get; set; }
            public string CustomerId { get; set; }
        }

        public class GetCartResponse
        {
            public string CartId { get; set; }
            public int CartItemCount { get; set; }
        }

        public class Handler : IRequestHandler<GetCartRequest, ResponseBase<GetCartResponse>>
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

            public async Task<ResponseBase<GetCartResponse>> Handle(GetCartRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var cartDetails = await _cartRepositoryServices.GetCartDetails(request);
                    var getcartResponse = _mapper.Map<GetCartResponse>(cartDetails);
                    return new ResponseBase<GetCartResponse> { Content=getcartResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Cart  : " + nameof(GetCartHandler));
                    throw ex;
                }
            }
        }
    }
}