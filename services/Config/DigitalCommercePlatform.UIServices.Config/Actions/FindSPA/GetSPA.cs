using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.SPA;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.FindSPA
{
    public class GetSPA
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string[] ProductIds { get; set; }
            public string VendorBidNumber { get; set; }
            public string VendorName { get; set; }
            public string EndUserName { get; set; }
            public DateTime? ValidFrom { get; set; }
            public DateTime? ValidTo { get; set; }
            public DateTime? UpdatedFrom { get; set; }
            public DateTime? UpdatedTo { get; set; }
            public bool Details { get; set; }
            public SortField? Sort { get; set; }
            public bool SortAscending { get; set; } = true;
            public bool TotalCount { get; set; } = true;
            public string[] MfrPartNumbers { get; set; }
            public int Page { get; set; } = 1;
            public int PageSize { get; set; } = 25;

            public Request()
            {
            }
        }

        public class Response 
        {
            public int Count { get; set; }
            public IList<SPAResponse> response { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IConfigService _configService;
            private readonly IMapper _mapper;

            public Handler(IConfigService configService, IMapper mapper)
            {
                _configService = configService;
                _mapper = mapper;
            }
            
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                    var spaDetails = await _configService.GetSPADetails(request).ConfigureAwait(false);
                    var getSpaResponse = _mapper.Map<Response>(spaDetails);

                    return new ResponseBase<Response> { Content = getSpaResponse };
            }
        }
    }
}
