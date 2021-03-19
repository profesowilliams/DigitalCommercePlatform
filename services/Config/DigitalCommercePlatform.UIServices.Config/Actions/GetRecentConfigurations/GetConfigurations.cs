using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Services;
using MediatR;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations
{
    [ExcludeFromCodeCoverage]
    public sealed class GetConfigurations
    {
        public class Request : IRequest<Response>
        {
            public FindModel Criteria { get; set; }
        }

        public class Response
        {
            public RecentConfigurationsModel Content { get; }

            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(RecentConfigurationsModel records)
            {
                Content = records;
            }
        }

        public class GetConfigurationsHandler : IRequestHandler<Request, Response>
        {
            private readonly IConfigService _configServiceQueryService;
            private readonly IMapper _mapper;

            public GetConfigurationsHandler(IConfigService commerceQueryService, IMapper mapper)
            {
                _configServiceQueryService = commerceQueryService;
                _mapper = mapper;
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                if (request.Criteria != null)
                {
                    RecentConfigurationsModel configurations = await _configServiceQueryService.GetConfigurations(request.Criteria);
                    var response = new Response(configurations);
                    response.ErrorCode = ""; // fix this
                    response.IsError = false;
                    return response;                    
                }
                else
                {
                    var response = new Response(null);
                    response.ErrorCode = "possible_invalid_code"; // fix this
                    response.IsError = true;
                    return response;
                }

            }
        }
    }
}
