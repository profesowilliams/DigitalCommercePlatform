using System;
using MediatR;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Browse.Services;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails
{
    public class GetCatalogueHandler : IRequestHandler<GetCatalogueRequest, GetCatalogueResponse>
    {
        private readonly IBrowseService _catalogueRepositoryService;
        private readonly IMapper _mapper;
        private readonly ICachingServicec _cachingService;
        private readonly ILogger<GetCatalogueHandler> _logger;

        public GetCatalogueHandler(IBrowseService catalogueRepositoryServices,
            IMapper mapper,
            ICachingServicec cachingService,
            ILogger<GetCatalogueHandler> logger
            )
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
