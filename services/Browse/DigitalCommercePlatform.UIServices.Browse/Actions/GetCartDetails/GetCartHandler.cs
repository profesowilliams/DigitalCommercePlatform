using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Services;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails
{
    public static class GetCartHandler
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public Request(bool isDefault)
            {
                IsDefault = isDefault;
            }

            public bool IsDefault { get; set; } = true;
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

            public Handler(IBrowseService cartRepositoryServices, IMapper mapper)
            {
                _cartRepositoryServices = cartRepositoryServices;
                _mapper = mapper;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var cartDetails = await _cartRepositoryServices.GetCartDetails(request);
                var getcartResponse = _mapper.Map<Response>(cartDetails);
                return new ResponseBase<Response> { Content = getcartResponse };
            }
        }
    }
}