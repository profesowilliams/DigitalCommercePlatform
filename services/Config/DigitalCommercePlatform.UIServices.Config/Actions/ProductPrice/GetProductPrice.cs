//2021 (c) Tech Data Corporation -. All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.GetProductPrice;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.ProductPrice
{
    public class GetProductPrice
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public PriceCriteriaModel PriceModel { get; set; }

            public Request(PriceCriteriaModel priceModel)
            {
                PriceModel = priceModel;
            }
        }

        public class Response
        {
            public IReadOnlyList<PriceModel> Results { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            protected readonly IMapper _mapper;
            protected readonly IConfigService _configService;
            private readonly ILoggerFactory _logger;
            private readonly IHttpClientFactory _httpClient;

            public Handler(IMapper mapper,ILoggerFactory loggerFactory,
                IConfigService configService,IHttpClientFactory httpClientFactory)                
            {
                _mapper = mapper;
                _configService = configService;
                _logger = loggerFactory;
                _httpClient=httpClientFactory;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var productPrice = await _configService.GetProductPrice(request);
                var response = new ResponseBase<Response> { Content = productPrice };
                return response;
            }
        }
    }
}
