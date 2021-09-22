//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Models.Content;
using DigitalCommercePlatform.UIServices.Search.Models.Content.App;
using DigitalCommercePlatform.UIServices.Search.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Actions.Content
{
    public sealed class FullSearch
    {
        public class Request : IRequest<Response>
        {
            public FullSearchRequestModel FullSearchRequestModel { get; set; }

            public Request(FullSearchRequestModel fullSearchRequestModel)
            {
                FullSearchRequestModel = fullSearchRequestModel;
            }
        }

        public class Response
        {
            public FullSearchResponseModel Results { get; set; }

            public Response(FullSearchResponseModel results)
            {
                Results = results;
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IContentService _contentService;
            private readonly ILogger<Handler> _logger;
            private readonly IMapper _mapper;

            public Handler(IContentService contentService, ILogger<Handler> logger, IMapper mapper)
            {
                _contentService = contentService;
                _logger = logger;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var appRequest = _mapper.Map<AppFullSearchRequestModel>(request.FullSearchRequestModel);
                var getContentData = await _contentService.GetContentData(appRequest);
                return new Response(_mapper.Map<FullSearchResponseModel>(getContentData));
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.FullSearchRequestModel).NotNull();
                RuleFor(c => c.FullSearchRequestModel.Keyword).NotNull();
            }
        }
    }
}
