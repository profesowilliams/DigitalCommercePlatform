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

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails
{
    [ExcludeFromCodeCoverage]
    public sealed class GetHeaderHandler
    {
        public class GetHeaderRequest : IRequest<GetHeaderResponse>
        {
            public string customerId { get; set; }
            public string userId { get; set; }
            public string catalogueCriteria { get; set; }

            public GetHeaderRequest(string CustomerId, string UserId, string CatalogueCriteria)
            {
                customerId = CustomerId;
                userId = UserId;
                catalogueCriteria = CatalogueCriteria;
            }
        }
        public class GetHeaderResponse
        {
            public string UserId { get; set; }
            public string UserName { get; set; }
            public string CustomerId { get; set; }
            public string CustomerName { get; set; }
            public string CartId { get; set; }
            public int CartItemCount { get; set; }
            public List<CatalogHierarchyModel> CatalogHierarchies { get; set; }

        }
        public class Handler : IRequestHandler<GetHeaderRequest, GetHeaderResponse>
        {
            private readonly IBrowseService _headerRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<GetHeaderHandler> _logger;
            public Handler(IBrowseService headerRepositoryServices,
                IMapper mapper,
                ILogger<GetHeaderHandler> logger)
            {
                _headerRepositoryServices = headerRepositoryServices;
                _logger = logger;
                _mapper = mapper;
            }

            public async Task<GetHeaderResponse> Handle(GetHeaderRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var headerDetails = await _headerRepositoryServices.GetHeader(request);
                    var geteaderhResponse = _mapper.Map<GetHeaderResponse>(headerDetails);
                    return geteaderhResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at GetHeaderHandler : " + nameof(GetHeaderHandler));
                    throw;
                }

            }
        }
    }
    
}
