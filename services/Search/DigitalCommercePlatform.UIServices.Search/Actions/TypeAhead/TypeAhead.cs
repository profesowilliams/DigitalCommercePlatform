//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Helpers;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using DigitalCommercePlatform.UIServices.Search.Services;
//using DigitalFoundation.Common.Services.Pipeline;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead
{
    public sealed class TypeAhead
    {
        public class Request : IRequest<Response>
        {
            public string SearchTerm { get; set; }
            public int? MaxResults { get; set; }
            public string Type { get; set; }

            public Request(string searchTerm)
            {
                SearchTerm = searchTerm;
            }
        }

        public class Response
        {
            public TypeAheadResponseModel Results { get; set; }

            public Response(TypeAheadResponseModel results)
            {
                Results = results;
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ISearchService _searchService;
            private readonly ILogger<Handler> _logger;
            private readonly TypeAheadType _searchTypeAhead;

            public Handler(ISearchService searchService, ILogger<Handler> logger, ISiteSettings siteSettings)
            {
                _searchService = searchService;
                _logger = logger;
                _searchTypeAhead = JsonHelper.DeserializeObjectSafely<TypeAheadType>(
                    value: siteSettings.TryGetSetting("Search.UI.TypeAhead")?.ToString(),
                    settings: JsonSerializerSettingsHelper.GetJsonSerializerSettings(),
                    defaultValue: null);
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                request.MaxResults = _searchTypeAhead.MaximumResults;
                request.Type = _searchTypeAhead.Type;
                var getTypeAheadDetails = await _searchService.GetTypeAhead(request);
                var response = 
                     new TypeAheadResponseModel() {
                        ResultGroups = new List<TypeAheadResultGroup>() {
                            new TypeAheadResultGroup()
                            {
                                Group = request.Type,
                                Results = getTypeAheadDetails
                            }
                        }
                    };
                return new Response(response);
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.SearchTerm).NotNull();
            }
        }
    }
}
