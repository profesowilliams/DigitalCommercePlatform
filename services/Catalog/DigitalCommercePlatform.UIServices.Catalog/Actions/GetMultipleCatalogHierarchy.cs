using DigitalCommercePlatform.UIService.Catalog.Models;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Catalog.Actions
{
    public static class GetMultipleCatalogHierarchy
    {
        public class Request : IRequest<Response>
        {
            public IEnumerable<string> Id { get; set; }
        }

        public class Response
        {
            public IEnumerable<CatalogHierarchyModel> CatalogHierarchies { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ILogger<Handler> _logger;
            private readonly IMiddleTierHttpClient _client;
            private readonly string _AppCatalogUrl;

            public Handler(
                ILogger<Handler> logger,
                IMiddleTierHttpClient httpClient)
            {
                _logger = logger;
                _client = httpClient;
                _AppCatalogUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-catalog/v1/";
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    _logger.LogInformation("UIService.Catalog.Hierarchy");

                    var requestPath = _AppCatalogUrl.BuildQuery(request);

                    var appResponse = await _client.GetAsync<Response>(requestPath).ConfigureAwait(false);
                    return appResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at: " + nameof(GetMultipleCatalogHierarchy));
                    throw;
                }
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(d => d.Id).Cascade(CascadeMode.Stop)
                    .NotNull()
                    .Must((x, ids) => ids.Any())
                    .WithMessage($"Expected {nameof(Request)}.{nameof(Request.Id)} to has at least one item.");
            }
        }
    }
}