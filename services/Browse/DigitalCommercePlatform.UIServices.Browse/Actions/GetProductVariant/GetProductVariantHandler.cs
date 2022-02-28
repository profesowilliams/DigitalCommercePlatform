//2022 (c) Tech Data Corporation - All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Models.ProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductVariant
{
    public class GetProductVariantHandler
    {
        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IBrowseService _browseServices;
            private readonly IMapper _mapper;

            public Handler(IBrowseService browseServices, IMapper mapper)
            {
                _browseServices = browseServices;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var productVariantDto = await _browseServices.GetProductVariant(request);

                var productVariantModel = _mapper.Map<ProductVariantModel>(productVariantDto);

                return new Response(productVariantModel);
            }
        }

        public class Response : ResponseBase<ProductVariantModel>
        {
            public Response(ProductVariantModel product)
            {
                Content = product;
            }
        }

        public class Request : IRequest<Response>
        {
            public Request(string id)
            {
                Id = id;
            }

            public string Id { get; set; }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.Id).NotEmpty();
            }
        }
    }
}