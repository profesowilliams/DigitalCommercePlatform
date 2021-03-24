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

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails
{
    [ExcludeFromCodeCoverage]
    public static class GetHeaderHandler
    {
        public class GetHeaderRequest : IRequest<ResponseBase<GetHeaderResponse>>
        {
            public string CustomerId { get; set; }
            public string UserId { get; set; }
            public string CatalogCriteria { get; set; }

            public GetHeaderRequest(string customerId, string userId, string catalogCriteria)
            {
                CustomerId = customerId;
                UserId = userId;
                CatalogCriteria = catalogCriteria;
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
            public IReadOnlyCollection<CatalogHierarchyModel> CatalogHierarchies { get; set; }
        }

        public class Handler : IRequestHandler<GetHeaderRequest, ResponseBase<GetHeaderResponse>>
        {
            private readonly IBrowseService _headerRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IBrowseService headerRepositoryServices,
                IMapper mapper,
                ILogger<Handler> logger)
            {
                _headerRepositoryServices = headerRepositoryServices;
                _logger = logger;
                _mapper = mapper;
            }

            public async Task<ResponseBase<GetHeaderResponse>> Handle(GetHeaderRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var headerDetails = await _headerRepositoryServices.GetHeader(request);
                    var headerResponse = _mapper.Map<GetHeaderResponse>(headerDetails);
                    return new ResponseBase<GetHeaderResponse> { Content = headerResponse };
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