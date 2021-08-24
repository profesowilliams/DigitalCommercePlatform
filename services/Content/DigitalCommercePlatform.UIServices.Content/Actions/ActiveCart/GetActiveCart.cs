//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalCommercePlatform.UIServices.Content.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Actions.ActiveCart
{
    [ExcludeFromCodeCoverage]
    public class GetActiveCart
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
        }

        public class Response
        {
            public ActiveCartModel Data { get; set; }
        }

        public class GetActiveCartHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IContentService _contentService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetActiveCart> _logger;

            public GetActiveCartHandler(IContentService contentService, IMapper mapper, ILogger<GetActiveCart> logger)
            {
                _contentService = contentService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var cartDetails = await _contentService.GetActiveCartDetails();
                var getProductResponse = _mapper.Map<Response>(cartDetails);
                return new ResponseBase<Response> { Content = getProductResponse };
            }
        }
    }
}
