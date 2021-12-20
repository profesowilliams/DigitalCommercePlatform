//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Models.Search;
using DigitalCommercePlatform.UIServices.Content.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead
{
    [ExcludeFromCodeCoverage]
    public sealed class TypeAheadSearch
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string SearchTerm { get; set; }
            public int? MaxResults { get; set; }
            public string Type { get; set; }

            public Request(string searchTerm, int? maxResults, string type)
            {
                SearchTerm = searchTerm;
                MaxResults = maxResults;
                Type = type;
            }
        }

        public class Response
        {
            public IEnumerable<TypeAheadSuggestion> Items { get; set; }
        }

        public class GetTypeAheadHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IContentService _contentService;
            private readonly IMapper _mapper;
            private readonly ILogger<TypeAheadSearch> _logger;

            public GetTypeAheadHandler(IContentService contentService, IMapper mapper, ILogger<TypeAheadSearch> logger)
            {
                _contentService = contentService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var getTypeAheadDetails = await _contentService.GetTypeAhead(request);
                var getResponse = _mapper.Map<Response>(getTypeAheadDetails);
                return new ResponseBase<Response> { Content = getResponse };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.SearchTerm).NotNull();
                RuleFor(c => c.MaxResults).NotNull().GreaterThanOrEqualTo(0);
                RuleFor(c => c.Type).NotNull();
            }
        }
    }
}
