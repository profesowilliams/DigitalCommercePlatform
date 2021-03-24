using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using DigitalCommercePlatform.UIServices.Browse.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary
{
    [ExcludeFromCodeCoverage]
    public static class FindSummaryHandler
    {
        public class FindSummaryRequest : IRequest<ResponseBase<FindSummaryResponse>>
        {
            public IEnumerable<string> MaterialNumber { get; set; }
            public IEnumerable<string> OldMaterialNumber { get; set; }
            public IEnumerable<string> Manufacturer { get; set; }
            public IEnumerable<string> MfrPartNumber { get; set; }
            public IEnumerable<string> UPC { get; set; }
            public string CustomerNumber { get; set; }
            public string CustomerPartNumber { get; set; }
            public string SalesOrganization { get; set; }
            public IEnumerable<string> MaterialStatus { get; set; }
            public IEnumerable<string> Territories { get; set; }
            public string Description { get; set; }
            public string System { get; set; }
            public bool Details { get; set; } = true;

            public FindSummaryRequest(FindProductModel query)
            {
                MaterialNumber = query.MaterialNumber;
                OldMaterialNumber = query.OldMaterialNumber;
                Manufacturer = query.Manufacturer;
                MfrPartNumber = query.MfrPartNumber;
                UPC = query.UPC;
                CustomerNumber = query.CustomerNumber;
                CustomerPartNumber = query.CustomerPartNumber;
                SalesOrganization = query.SalesOrganization;
                MaterialStatus = query.MaterialStatus;
                Territories = query.Territories;
                Description = query.Description;
                System = query.System;
                Details = query.Details;
            }
        }

        public class FindSummaryResponse 
        {
            public SummaryDetails SummaryModels { get; set; }
        }

        public class Handler : IRequestHandler<FindSummaryRequest, ResponseBase<FindSummaryResponse>>
        {
            private readonly IBrowseService _productRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IBrowseService productRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _productRepositoryServices = productRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<FindSummaryResponse>> Handle(FindSummaryRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _productRepositoryServices.FindSummaryDetails(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<FindSummaryResponse>(productDetails);
                    return new ResponseBase<FindSummaryResponse> { Content = getProductResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw;
                }
            }
        }

        
    }
}