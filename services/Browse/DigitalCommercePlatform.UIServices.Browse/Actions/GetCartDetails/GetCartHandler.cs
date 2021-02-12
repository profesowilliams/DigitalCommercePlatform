using System;
using MediatR;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Browse.Services;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails
{
    public class GetCartHandler : IRequestHandler<GetCartRequest, GetCartResponse>
    {
        private readonly IBrowseService _cartRepositoryServices;
        private readonly IMapper _mapper;
        private readonly ILogger<GetCartHandler> _logger;

        public GetCartHandler(IBrowseService cartRepositoryServices, IMapper mapper, ILogger<GetCartHandler> logger)
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
