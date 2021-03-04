using AutoMapper;
using Azure;
using DigitalCommercePlatform.UIServices.Browse.Models.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Core.Models.DTO.Common;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails
{
    public class GetProductHandler
    {
        public class GetProductDetailsRequest : IRequest<GetProductDetailsResponse>
        {
            public List<string> Id { get; set; }
            public bool Details { get; set; }

            public GetProductDetailsRequest(List<string> id, bool details)
            {
                Id = id;
                Details = details;
            }
        }

        public class GetProductDetailsResponse : PaginatedResponse<IEnumerable<ProductModel>>
        {
            public GetProductDetailsResponse()
            {

            }
            public GetProductDetailsResponse(IEnumerable<ProductModel> response)
            {
                ReturnObject = response;
            }
        }

        public class Handler : IRequestHandler<GetProductDetailsRequest, GetProductDetailsResponse>
        {
            private readonly IBrowseService _browseRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            public Handler(IBrowseService browseRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _browseRepositoryServices = browseRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<GetProductDetailsResponse> Handle(GetProductDetailsRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _browseRepositoryServices.GetProductdetials(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<GetProductDetailsResponse>(productDetails);
                    return getProductResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw;
                }
            }
        }

        public class Validator : AbstractValidator<GetProductDetailsRequest>
        {
            public Validator()
            {
                SetRules();
            }

            private void SetRules()
            {
                RuleFor(r => r.Id).NotEmpty();
            }
        }
    }
}
