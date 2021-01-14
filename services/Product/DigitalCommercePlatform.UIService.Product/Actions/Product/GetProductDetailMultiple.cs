using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Dto.Product;
using DigitalCommercePlatform.UIService.Product.Models.Product;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using DigitalFoundation.Core.Models.DTO.Common;
using FluentValidation;
using Flurl;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
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
            private readonly string _AppProductUrl;
            private readonly IMapper _mapper;
           

            public Handler(IMapper mapper, IMiddleTierHttpClient client, ILogger<GetProductDetailMultiple> logger, IOptions<AppSettings> options)
            {
                _client = client;
                _logger = logger;
                _AppProductUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1";
                _mapper = mapper;
            }

            public async Task<GetProductDetailMultipleResponse> Handle(Request request, CancellationToken cancellationToken)
            {                
                try
                {
                    _logger.LogInformation($"UIService.Product.GetProductDetailMultiple");
                    var url = $"{_AppProductUrl}/"
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