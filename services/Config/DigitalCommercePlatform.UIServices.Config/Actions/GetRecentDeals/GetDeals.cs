using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Services;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals
{
    public class GetDeals
    {
        public class Request : IRequest<Response>
        {
            public FindModel Criteria { get; set; }
        }
        public class Response
        {
            public RecentDealsModel Content { get; }

            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(RecentDealsModel records)
            {
                Content = records;
            }
        }

        public class GetDealssHandler : IRequestHandler<Request, Response>
        {
            private readonly IConfigService _configServiceQueryService;
            private readonly IMapper _mapper;

            public GetDealssHandler(IConfigService commerceQueryService, IMapper mapper)
            {
                _configServiceQueryService = commerceQueryService;
                _mapper = mapper;
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                RecentDealsModel response = await _configServiceQueryService.GetDeals(request.Criteria);

                return new Response(response);
            }
        }
    }
}
