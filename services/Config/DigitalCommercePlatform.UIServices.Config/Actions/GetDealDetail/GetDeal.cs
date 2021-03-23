using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Services;
using MediatR;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail
{
    [ExcludeFromCodeCoverage]
    public sealed class GetDeal
    {
        public class Request : IRequest<Response>
        {
            public FindModel Criteria { get; set; }
        }

        public class Response
        {
            public DealsDetailModel Content { get; }
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }
            public string ErrorDescription { get; set; }
            public Response(DealsDetailModel records)
            {
                Content = records;
            }
        }

        public class GetDealHandler : IRequestHandler<Request, Response>
        {
            private readonly IConfigService _configServiceQueryService;
            private readonly IMapper _mapper;

            public GetDealHandler(IConfigService commerceQueryService, IMapper mapper)
            {
                _configServiceQueryService = commerceQueryService;
                _mapper = mapper;
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                if (request.Criteria.DealId != null)
                {
                    DealsDetailModel deal = await _configServiceQueryService.GetDealDetails(request.Criteria);                   
                    var response = new Response(deal);
                    response.ErrorCode = ""; // fix this
                    response.IsError = false;
                    return response;
                }
                else // fix this once APP service is ready
                {
                    var response = new Response(null);
                    response.ErrorCode = ""; 
                    response.IsError = false;
                    return response;
                }

            }
        }
    }
}
