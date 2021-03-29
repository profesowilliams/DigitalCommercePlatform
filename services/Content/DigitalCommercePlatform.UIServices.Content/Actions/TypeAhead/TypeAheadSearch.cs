using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Content.Models.Search;
using DigitalCommercePlatform.UIServices.Content.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
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
            public string SearchApplication { get; set; }
            public string Keyword { get; set; }

            public Request(string keyword, string searchApplication)
            {
                Keyword = keyword;
                SearchApplication = searchApplication;
            }

        }

        public class Response
        {
            public TypeAheadSuggestion[] Suggestions { get; set; }
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
    }
}
