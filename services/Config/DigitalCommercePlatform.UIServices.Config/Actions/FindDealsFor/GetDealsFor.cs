//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.FindDealsFor
{
    [ExcludeFromCodeCoverage]
    public class GetDealsFor
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string[] ProductIds { get; set; }
            public string EndUserName { get; set; }
            public bool Details { get; set; }
            public string[] MfrPartNumbers { get; set; }
            public int Page { get; set; } = 1;
            public int PageSize { get; set; } = 25;
            public Request()
            {
            }
        }

        public class Response
        {
            public IList<DealsForGrid> response { get; set; }
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

                var dealsDetails = await _configService.GetDealsFor(request).ConfigureAwait(false);
                var dealsResponse = _mapper.Map<Response>(dealsDetails);
                var getDealsResponse = new Response
                {                  
                    response = dealsResponse.response,
                };
                return new ResponseBase<Response> { Content = getDealsResponse };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Page)
                    .NotEmpty().GreaterThan(0).WithMessage("Page must be greater than 0.");
                RuleFor(x => x.PageSize)
                    .NotEmpty().GreaterThan(0).WithMessage("PageSize must be greater than 0.");
            }
        }
    }
}
