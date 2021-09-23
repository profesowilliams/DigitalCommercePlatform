//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Product.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Product.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Product.Actions
{
    public class ProductDetails
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }

            public Request(string id)
            {
                Id = id;
            }
        }

        public class Response
        {
            public IEnumerable<ProductModel> Items { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IProductService _productService;
            private readonly IMapper _mapper;

            public Handler(IProductService productService, IMapper mapper)
            {
                _productService = productService;
                _mapper = mapper;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var productDetails = await _productService.GetProductDetails(request).ConfigureAwait(false);
                var getProductResponse = _mapper.Map<Response>(productDetails);
                return new ResponseBase<Response> { Content = getProductResponse };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.Id).NotEmpty().WithMessage("Product id is missing");
            }
        }
    }
}
