//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalCommercePlatform.UIServices.Content.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Actions
{
    [ExcludeFromCodeCoverage]
    public class AddCartItem
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public List<CartItemModel> Items { get; set; }

            public Request(List<CartItemModel> items)
            {
                Items = items;
            }
        }

        public class Response
        {
            public CartItemModel CartItemModel { get; }

            public Response(CartItemModel cartItemModel)
            {
                CartItemModel = cartItemModel;
            }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IContentService _service;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IContentService service, IMapper mapper, ILogger<Handler> logger)
            {
                _service = service;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var response = await _service.AddItemCart(request);
                    return new ResponseBase<Response> { Content = response };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error adding item to cart in {nameof(AddCartItem)}");
                    throw;
                }
            }

            public class Validator : AbstractValidator<Request>
            {
                public Validator()
                {
                    RuleFor(r => r.Items).Cascade(CascadeMode.Stop).NotNull()
                        .ChildRules(request =>
                        {
                            request.RuleForEach(o => o).Where(p => p.ProductId != null);
                        });
                }
            }
        }
    }
}
