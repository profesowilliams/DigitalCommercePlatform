using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Actions.DetailsOfSavedCart
{
    [ExcludeFromCodeCoverage]
    public static class GetCartDetails
    {
        public class GetCartRequest : IRequest<GetCartResponse>
        {
            public string userId { get; set; }

            public GetCartRequest(string UserId)
            {
                userId = UserId;
            }
        }

        public class GetCartResponse
        {
            public SavedCarts SavedCarts { get; set; }


        }
        public class Handler : IRequestHandler<GetCartRequest, GetCartResponse>
        {
            private readonly IAccountService _cartRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IAccountService cartRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _cartRepositoryServices = cartRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<GetCartResponse> Handle(GetCartRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var cartDetails = await _cartRepositoryServices.GetCartDetailsAsync(request);
                    var getcartResponse = _mapper.Map<GetCartResponse>(cartDetails);

                    return getcartResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Cart  : " + nameof(GetCartDetails));
                    throw;
                }
            }
        }
    }
}
