using AutoMapper;
using DigitalCommercePlatform.UIService.Catalogue.DTO;
using DigitalCommercePlatform.UIService.Catalogue.Models;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using Flurl;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Catalogue.Actions.Catalogue
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1052:Static holder types should be Static or NotInheritable", Justification = "<Pending>")]
    public class GetMultipleCatalogHierarchy
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1034:Nested types should not be visible", Justification = "<Pending>")]
        public class Request : IRequest<Response>
        {
            public IEnumerable<string> Id { get; set; }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1034:Nested types should not be visible", Justification = "<Pending>")]
        public class Response
        {
            public IEnumerable<CatalogHierarchyModel> CatalogHierarchies { get; set; }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1034:Nested types should not be visible", Justification = "<Pending>")]
        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly IMiddleTierHttpClient _client;
            private readonly string _AppCatalogUrl;

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Usage", "CA1801:Review unused parameters", Justification = "<Pending>")]
            public Handler(IMapper mapper, ILogger<Handler> logger, IMiddleTierHttpClient httpClient, IOptions<AppSettings> options)
            {
                _mapper = mapper;
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

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1034:Nested types should not be visible", Justification = "<Pending>")]
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(req => req).NotNull().NotEmpty();
            }
        }
    }
}
