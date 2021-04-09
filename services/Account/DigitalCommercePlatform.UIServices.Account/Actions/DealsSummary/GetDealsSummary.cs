using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary
{
    [ExcludeFromCodeCoverage]
    public sealed class GetDealsSummary
    {
        public class Request : IRequest<Response>
        {
            public string Criteria { get; set; }
        }

        public class Response
        {
            public DealsSummaryModel Summary { get; set; }
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }
            public string ErrorDescription { get; set; }

            public Response(DealsSummaryModel summary)
            {
                Summary = summary;
            }
        }

        public class DealsSummaryQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly IAccountService _accountQueryService;
            private readonly IMapper _mapper;

            public DealsSummaryQueryHandler(IAccountService accountQueryService, IMapper mapper)
            {
                _accountQueryService = accountQueryService;
                _mapper = mapper;
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                if (request.Criteria != null)
                {
                    var response = await _accountQueryService.GetDealsSummaryAsync(request);
                    return new Response(response);
                }
                else
                {
                    var response = new Response(null);
                    response.ErrorCode = "forbidden"; // fix this
                    response.IsError = true;
                    return response;
                }

            }
        }
    }
}
