//2021 (c) Tech Data Corporation - All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.Refresh
{
    public sealed class RefreshData
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string VendorName { get; set; }
            public string Type { get; set; }
            public string Version { get; set; }

            public Request()
            {
                
            }
        }

        public class Response
        {
            public bool Items { get; set; }
        }

        public class Handler : HandlerBase<Handler>, IRequestHandler<Request, ResponseBase<Response>>
        {
            protected readonly IMapper _mapper;
            protected readonly IConfigService _configService;

            public Handler(
                IMapper mapper,
                ILoggerFactory loggerFactory,
                IConfigService configService,
                IHttpClientFactory httpClientFactory)
                : base(loggerFactory, httpClientFactory)
            {
                _mapper = mapper;
                _configService = configService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var data = await _configService.RefreshVendor(request).ConfigureAwait(false);
                var response = new Response
                {
                    Items = data.Items,
                };
                return new ResponseBase<Response> { Content = response };
            }
        }
    }
}
