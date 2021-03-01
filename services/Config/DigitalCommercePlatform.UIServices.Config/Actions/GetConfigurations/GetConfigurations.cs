using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Configuration;
using DigitalCommercePlatform.UIServices.Config.Services;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetConfigurations
{
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
                RecentConfigurationsModel response = await _configServiceQueryService.GetConfigurations(request.Criteria);

                return new Response(response);
            }
        }
    }
}
