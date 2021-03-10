using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary
{
    [ExcludeFromCodeCoverage]
    public sealed class GetActionItems
    {
        public class Request : IRequest<Response>
        {
            public string Criteria { get; set; }
        }

        public class Response
        {
            public ActionItemsModel Summary { get; set; }
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }
            public string ErrorDescription { get; set; }

            public Response(ActionItemsModel summary)
            {
                Summary = summary;
            }
        }

        public class ActionItemsSummaryQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly IAccountService _accountQueryService;
            private readonly IMapper _mapper;

            public ActionItemsSummaryQueryHandler(IAccountService accountQueryService, IMapper mapper)
            {
                _accountQueryService = accountQueryService;
                _mapper = mapper;
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                if (request.Criteria != null)
                {
                    var response = await _accountQueryService.GetActionItemsSummaryAsync(request);
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
