using System;
using MediatR;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalCommercePlatform.UIService.Browse.Models.Catalogue;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails
{
    [ExcludeFromCodeCoverage]
    public sealed class GetCatalogueHandler
    {
        public class GetCatalogueRequest : IRequest<GetCatalogueResponse>
        {
            public string Id { get; set; }

            public GetCatalogueRequest(string catalogueId)
            {
                Id = catalogueId;
            }
        }
        public class GetCatalogueResponse
        {
            public IEnumerable<CatalogHierarchyModel> CatalogHierarchies { get; set; }
        }
        public class Handler : IRequestHandler<GetCatalogueRequest, GetCatalogueResponse>
        {
            private readonly IBrowseService _catalogueRepositoryService;
            private readonly IMapper _mapper;
            private readonly ICachingServicec _cachingService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBrowseService catalogueRepositoryServices, IMapper mapper, ICachingServicec cachingService, ILogger<Handler> logger)
            {
                _catalogueRepositoryService = catalogueRepositoryServices;
                _mapper = mapper;
                _cachingService = cachingService;
                _logger = logger;
            }

            public async Task<GetCatalogueResponse> Handle(GetCatalogueRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var getCatalogueResponse = new GetCatalogueResponse();
                    //get catalog from cache 
                    getCatalogueResponse = await _cachingService.GetCatalogueFromCache(request.Id);

                    if (getCatalogueResponse == null)
                    {
                        var CatalogueDetails = await _catalogueRepositoryService.GetCatalogueDetails(request);
                        getCatalogueResponse = _mapper.Map<GetCatalogueResponse>(CatalogueDetails);
                    }
                    return getCatalogueResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Catalogue : " + nameof(GetCatalogueHandler));

                    throw ex;
                }

            }
        }
    }
    
}
