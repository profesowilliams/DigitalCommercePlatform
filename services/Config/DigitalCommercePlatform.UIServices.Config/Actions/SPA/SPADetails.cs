//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.Spa
{
    public class SpaDetails
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
            public bool Details { get; set; }
            public string ProductIds { get; set; }
        }

        public class Response
        {
            public List<string> Items { get; set; }

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
                var data = await _configService.GetSpaDetails(request);
                return new ResponseBase<Response> { Content = data };

            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.Id)
                    .NotEmpty().WithMessage("SPA Id is required");
            }
        }
    }
}
