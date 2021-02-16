using System;
using MediatR;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Browse.Services;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails
{
    [ExcludeFromCodeCoverage]
    public sealed class GetCartHandler
    {
        public class GetCartRequest : IRequest<GetCartResponse>
        {
            public string userId { get; set; }
            public string customerId { get; set; }

            public GetCartRequest(string CustomerId, string UserId)
            {
                userId = UserId;
                customerId = CustomerId;
            }
        }

        public class GetCartResponse
        {
            public string CartId { get; set; }
            public int CartItemCount { get; set; }
        }
        public class Handler : IRequestHandler<GetCartRequest, GetCartResponse>
        {
            private readonly IBrowseService _cartRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<GetCartHandler> _logger;

            public Handler(IBrowseService cartRepositoryServices, IMapper mapper, ILogger<GetCartHandler> logger)
            {
                _cartRepositoryServices = cartRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<GetCartResponse> Handle(GetCartRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var cartDetails = await _cartRepositoryServices.GetCartDetails(request);
                    var getcartResponse = _mapper.Map<GetCartResponse>(cartDetails);
                    return getcartResponse;
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
