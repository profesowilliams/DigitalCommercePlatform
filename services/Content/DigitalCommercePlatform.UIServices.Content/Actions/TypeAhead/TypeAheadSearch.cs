using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Content.Models.Search;
using DigitalCommercePlatform.UIServices.Content.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
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

            public Request(string searchTerm, int? maxResults)
            {
                SearchTerm = searchTerm;
                MaxResults = maxResults;
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
                try
                {
                    var getTypeAheadDetails = await _contentService.GetTypeAhead(request);
                    var getResponse = _mapper.Map<Response>(getTypeAheadDetails);
                    return new ResponseBase<Response> { Content = getResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Cart  : " + nameof(TypeAheadSearch));
                    throw ex;
                }
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.SearchTerm).NotNull();
                RuleFor(c => c.MaxResults).NotNull().GreaterThanOrEqualTo(0);
            }
        }
    }
}
