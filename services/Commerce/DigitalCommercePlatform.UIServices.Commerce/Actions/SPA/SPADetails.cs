//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.SPA;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Spa
{
    public class SpaDetails
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string DealId { get; set; }
            public List<SPAProduct> SPAProducts { get; set; }
            
        }

        public class Response
        {
            public bool SPA { get; set; }
            public List<string> Items { get; set; }

        }

        public class Handler : HandlerBase<Handler>, IRequestHandler<Request, ResponseBase<Response>>
        {
            protected readonly IMapper _mapper;
            protected readonly ICommerceService _commerceService;

            public Handler(
                IMapper mapper,
                ILoggerFactory loggerFactory,
                ICommerceService commerceService,
                IHttpClientFactory httpClientFactory)
                : base(loggerFactory, httpClientFactory)
            {
                _mapper = mapper;
                _commerceService = commerceService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var data = await _commerceService.CanApplySPA(request);
                return new ResponseBase<Response> { Content = data };

            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.DealId)
                    .NotEmpty().WithMessage("SPA Id is required");
            }
        }
    }
}
