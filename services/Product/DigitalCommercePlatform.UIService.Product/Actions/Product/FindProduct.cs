using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Models.Find;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using DigitalFoundation.Core.Models.DTO.Common;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.Actions.Product
{
    public sealed class FindProduct
    {
        public class Request : IRequest<Response>
        {
            public FindProductModel Query { get; set; }
            public bool WithPaginationInfo { get; set; }
            public int Page { get; set; }
            public int PageSize { get; set; }
        }

        public class Response : PaginatedResponse<IEnumerable<Models.Product.ProductModel>>
        {
            public Response()
            {
            }

            public Response(IEnumerable<Models.Product.ProductModel> response)
            {
                ReturnObject = response;
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly ILogger<Handler> _logger;
            private readonly IMapper _mapper;
            private readonly string _appProductUrl;

            public Handler(IMapper mapper, IMiddleTierHttpClient client, ILogger<Handler> logger)
            {
                _mapper = mapper;
                _client = client;
                _logger = logger;
                _appProductUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1/Find";
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    _logger.LogInformation($"UIService.Product.FindProduct");
                    var url = $"{_appProductUrl}/"
                       .BuildQuery(request)
                       ;

                    var data = await _client.GetAsync<Response>(url).ConfigureAwait(false);
                    return data;
                }
                catch (Exception ex)
                {
                    if (ex is RemoteServerHttpException)
                    {
                        var remoteEx = ex as RemoteServerHttpException;
                        if (remoteEx.Code == System.Net.HttpStatusCode.NotFound)
                        {
                            return null;
                        }
                    }
                    _logger.LogError(ex, $"Error getting product data in {nameof(FindProduct)}");
                    throw;
                }
            }
        }
    }
}