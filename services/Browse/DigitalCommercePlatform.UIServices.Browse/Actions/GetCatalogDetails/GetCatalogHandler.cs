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
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }

            public Request(string CatalogId)
            {
                Id = CatalogId;
            }
        }

        public class Response
        {
            public IEnumerable<CatalogHierarchyModel> CatalogHierarchies { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
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

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    //get catalog from cache
                    var getCatalogResponse = await _cachingService.GetCatalogFromCache(request.Id);

                    if (getCatalogResponse == null)
                    {
                        var CatalogDetails = await _CatalogRepositoryService.GetCatalogDetails(request);
                        getCatalogResponse = _mapper.Map<Response>(CatalogDetails);
                    }
                    return new ResponseBase<Response> { Content = getCatalogResponse };
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