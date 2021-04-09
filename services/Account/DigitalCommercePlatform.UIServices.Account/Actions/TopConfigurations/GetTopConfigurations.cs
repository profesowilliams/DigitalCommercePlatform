using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations
{
    [ExcludeFromCodeCoverage]
    public sealed class GetTopConfigurations
    {
        public class Request : IRequest<Response>
        {
            public string Criteria { get; set; }
        }

        public class Response
        {
            public ActiveOpenConfigurationsModel Summary { get; set; }
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }
            public string ErrorDescription { get; set; }

            public Response(ActiveOpenConfigurationsModel summary)
            {
                Summary = summary;
            }
        }

        public class GetTopConfigurationsQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly IAccountService _accountQueryService;
            private readonly IMapper _mapper;

            public GetTopConfigurationsQueryHandler(IAccountService accountQueryService, IMapper mapper)
            {
                _accountQueryService = accountQueryService;
                _mapper = mapper;
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                if (request.Criteria != null)
                {
                    var response = await _accountQueryService.GetTopConfigurationsAsync(request);
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
