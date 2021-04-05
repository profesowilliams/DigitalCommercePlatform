using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Services;
using FluentValidation;
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
    public static class FindProductHandler
    {
        public class Request : IRequest<ResponseBase<Response>>
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
            public bool WithPaginationInfo { get; set; }
            public int? Page { get; set; } 
            public int? PageSize { get; set; }
            public Sort SortBy { get; set; } = Sort.ID;
            public bool SortAscending { get; set; } = true;

            public Request(FindProductModel query,bool withPaginationInfo)
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
                Page = query.Page;
                PageSize = query.PageSize;
                SortBy = query.SortBy;
                SortAscending = query.SortAscending;
                WithPaginationInfo = withPaginationInfo;
            }
        }

        public class Response
        {
            public ProductData Items { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
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

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _productRepositoryServices.FindProductDetails(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<Response>(productDetails);
                    return new ResponseBase<Response> { Content = getProductResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw;
                }
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            private readonly ISortingService _sortingService;

            public Validator(ISortingService sortingService)
            {
                _sortingService = sortingService ?? throw new ArgumentNullException(nameof(sortingService));

                var validProperties = _sortingService.GetValidProperties();
                RuleFor(i => i.SortBy).Must(IsPropertyValidForSorting).WithMessage(i => $"You can't sort by {i.SortBy} property. Valid properties are: {validProperties}");
                RuleFor(i => i.PageSize).GreaterThan(0).WithMessage("Page Size must be greater than 0.");
                RuleFor(i => i.Page).GreaterThanOrEqualTo(0).WithMessage("PageNumber must be greater than or equal to 0.");
            }

            private bool IsPropertyValidForSorting(Sort arg)
            {
                return _sortingService.IsPropertyValid(arg.ToString());
            }
        }
    }
}