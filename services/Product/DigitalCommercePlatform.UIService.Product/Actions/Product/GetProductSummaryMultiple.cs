using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Models.Summary;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Core.Models.DTO.Common;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Product.Actions.Product
{
    [ExcludeFromCodeCoverage]
    public class GetProductSummaryMultiple
    {
        public class Request : IRequest<GetProductSummaryMultipleResponse>
        {
            public List<string> Id { get; set; }
            public bool Details { get; set; }
        }

        public class GetProductSummaryMultipleResponse : Response<IEnumerable<SummaryModel>>
        {
            public GetProductSummaryMultipleResponse(IEnumerable<SummaryModel> response)
            {
                ReturnObject = response;
            }
        }

        public class Handler : IRequestHandler<Request, GetProductSummaryMultipleResponse>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly ILogger<GetProductSummaryMultiple> _logger;
            private readonly IMapper _mapper;
            private readonly string _AppProductUrl;

            public Handler(IMapper mapper, IMiddleTierHttpClient client, ILogger<GetProductSummaryMultiple> logger,
                IOptions<AppSettings> options)
            {
                _mapper = mapper;
                _client = client;
                _logger = logger;
                _AppProductUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1";
            }

            public async Task<GetProductSummaryMultipleResponse> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    _logger.LogInformation($"UIService.Product.GetProductDetailMultiple");
                    var url = $"{_AppProductUrl}/"
                    .BuildQuery(request);

                    var AppResponse = await _client.GetAsync<GetProductSummaryMultipleResponse>(url).ConfigureAwait(false);

                    return AppResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting product data in {nameof(GetProductSummaryMultiple)}");
                    throw;
                }
            }
        }
    }
}