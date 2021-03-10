using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes
{
    [ExcludeFromCodeCoverage]
    public sealed class GetTopQuotes
    {
        public class Request : IRequest<Response>
        {
            public string Criteria { get; set; }
        }

        public class Response
        {
            public ActiveOpenQuotesModel Summary { get; set; }
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }
            public string ErrorDescription { get; set; }

            public Response(ActiveOpenQuotesModel summary)
            {
                Summary = summary;
            }
        }

        public class GetTopQuotesQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly IAccountService _accountQueryService;
            private readonly IMapper _mapper;

            public GetTopQuotesQueryHandler(IAccountService accountQueryService, IMapper mapper)
            {
                _accountQueryService = accountQueryService;
                _mapper = mapper;
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                if (request.Criteria != null)
                {
                    var response = await _accountQueryService.GetTopQuotesAsync(request);
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
