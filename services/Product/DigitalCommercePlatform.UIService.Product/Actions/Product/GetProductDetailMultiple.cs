using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Models.Product;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Core.Models.DTO.Common;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.Actions.Product
{
    public class GetProductDetailMultiple
    {
        public class Request : IRequest<GetProductDetailMultipleResponse>
        {
            public List<string> Id { get; set; }
            public bool Details { get; set; }
        }

        public class GetProductDetailMultipleResponse : Response<IEnumerable<ProductModel>>
        {
            public GetProductDetailMultipleResponse(IEnumerable<ProductModel> response)
            {
                ReturnObject = response;
            }
        }

        public class Handler : IRequestHandler<Request, GetProductDetailMultipleResponse>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly ILogger<GetProductDetailMultiple> _logger;
            private readonly string _appProductUrl;
            private readonly IMapper _mapper;

            public Handler(IMapper mapper, IMiddleTierHttpClient client, ILogger<GetProductDetailMultiple> logger)
            {
                _client = client;
                _logger = logger;
                _mapper = mapper;
                _appProductUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1";
            }

            public async Task<GetProductDetailMultipleResponse> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    _logger.LogInformation($"UIService.Product.GetProductDetailMultiple");
                    var url = $"{_appProductUrl}/"
                    .BuildQuery(request);

                    var AppResponse = await _client.GetAsync<GetProductDetailMultipleResponse>(url).ConfigureAwait(false);

                    return AppResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at: " + nameof(GetProductDetailMultiple));
                    throw;
                }
            }
        }
    }
}