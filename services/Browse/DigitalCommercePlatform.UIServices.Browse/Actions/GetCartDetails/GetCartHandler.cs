using System;
using MediatR;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Browse.Services;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails
{
    public class GetCartHandler : IRequestHandler<GetCartRequest, GetCartResponse>
    {
        private readonly IBrowseService _cartRepositoryServices;
        private readonly IMapper _mapper;

        public GetCartHandler(IBrowseService cartRepositoryServices, IMapper mapper)
        {
            _cartRepositoryServices = cartRepositoryServices;
            _mapper = mapper;
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
                throw ex;
            }
        }
    }
}
