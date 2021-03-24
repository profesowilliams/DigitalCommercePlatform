using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;

namespace DigitalCommercePlatform.UIServices.Account.Actions.DetailsOfSavedCart
{
    [ExcludeFromCodeCoverage]
    public static class GetCartDetails
    {
        public class GetCartRequest : IRequest<ResponseBase<GetCartResponse>>
        {
            public string userId { get; set; }

            public GetCartRequest(string UserId)
            {
                userId = UserId; // fix this
            }
        }

        public class GetCartResponse
        {
            public SavedCarts SavedCarts { get; set; }
        }
        public class GetSavedCartsQueryHandler : IRequestHandler<GetCartRequest, ResponseBase<GetCartResponse>>
        {
            private readonly IAccountService _accountServices;
            private readonly IMapper _mapper;
            private readonly ILogger<GetSavedCartsQueryHandler> _logger;

            public GetSavedCartsQueryHandler(IAccountService accountServices, 
                IMapper mapper, 
                ILogger<GetSavedCartsQueryHandler> logger)
            {
                _accountServices = accountServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<GetCartResponse>> Handle(GetCartRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var cartDetails = await _accountServices.GetCartDetailsAsync(request);
                    var getcartResponse = _mapper.Map<GetCartResponse>(cartDetails);
                    return new ResponseBase<GetCartResponse> { Content = getcartResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting users saved cart(s) : " + nameof(GetCartDetails));
                    throw;
                }
            }
        }
    }
}
