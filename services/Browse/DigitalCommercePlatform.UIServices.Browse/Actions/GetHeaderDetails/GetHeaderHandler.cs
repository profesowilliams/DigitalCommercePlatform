using MediatR;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Browse.Services;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails
{
    public class GetHeaderHandler :IRequestHandler<GetHeaderRequest, GetHeaderResponse>
    {
        private readonly IBrowseService _headerRepositoryServices;
        private readonly IMapper _mapper;

        public GetHeaderHandler(IBrowseService headerRepositoryServices, IMapper mapper)
        {
            _headerRepositoryServices = headerRepositoryServices;
            _mapper = mapper;
        }

        public async Task<GetHeaderResponse> Handle(GetHeaderRequest request, CancellationToken cancellationToken)
        {
            var headerDetails = await _headerRepositoryServices.GetHeader(request);
            var geteaderhResponse = _mapper.Map<GetHeaderResponse>(headerDetails);
            return geteaderhResponse;
        }
    }
}
