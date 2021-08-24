//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Actions.CreateCartByQuote
{
    [ExcludeFromCodeCoverage]
    public class GetCreateCartByQuote
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string QuoteId { get; set; }

            public Request(string quioteId)
            {
                QuoteId = quioteId;
            }
        }

        public class Response
        {
            public bool IsSuccess { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IContentService _contentService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IContentService contentService, IMapper mapper, ILogger<Handler> logger)
            {
                _contentService = contentService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var createByQuote = await _contentService.CreateCartByQuote(request.QuoteId);
                return new ResponseBase<Response> { Content = createByQuote };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.QuoteId).NotNull();
            }
        }
    }
}
