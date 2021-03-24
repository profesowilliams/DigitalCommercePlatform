using AutoMapper;
using DigitalCommercePlatform.UIService.Browse.Models.Catalog;
using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails
{
    [ExcludeFromCodeCoverage]
    public static class GetCatalogHandler
    {
        public class GetCatalogRequest : IRequest<ResponseBase<GetCatalogResponse>>
        {
            public string Id { get; set; }

            public GetCatalogRequest(string CatalogId)
            {
                Id = CatalogId;
            }
        }

        public class GetCatalogResponse
        {
            public IEnumerable<CatalogHierarchyModel> CatalogHierarchies { get; set; }
        }

        public class Handler : IRequestHandler<GetCatalogRequest, ResponseBase<GetCatalogResponse>>
        {
            private readonly IBrowseService _CatalogRepositoryService;
            private readonly IMapper _mapper;
            private readonly ICachingService _cachingService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBrowseService CatalogRepositoryServices, IMapper mapper, ICachingService cachingService, ILogger<Handler> logger)
            {
                _CatalogRepositoryService = CatalogRepositoryServices;
                _mapper = mapper;
                _cachingService = cachingService;
                _logger = logger;
            }

            public async Task<ResponseBase<GetCatalogResponse>> Handle(GetCatalogRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    //get catalog from cache
                    var getCatalogResponse = await _cachingService.GetCatalogFromCache(request.Id);

                    if (getCatalogResponse == null)
                    {
                        var CatalogDetails = await _CatalogRepositoryService.GetCatalogDetails(request);
                        getCatalogResponse = _mapper.Map<GetCatalogResponse>(CatalogDetails);
                    }
                    return new ResponseBase<GetCatalogResponse> { Content = getCatalogResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Catalog : " + nameof(GetCatalogHandler));

                    throw ex;
                }
            }
        }
    }
}