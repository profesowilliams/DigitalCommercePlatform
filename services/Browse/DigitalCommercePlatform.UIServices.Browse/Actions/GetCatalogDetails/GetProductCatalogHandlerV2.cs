//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Models.Catalog;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails
{
    public class GetProductCatalogHandlerV2
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public ProductCatalogRequest Input { get; set; }

            public Request(ProductCatalogRequest input)
            {
                Input = input;
            }
        }

        public class Response
        {
            public List<CatalogResponse> Items { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IBrowseService _browseService;

            public Handler(IBrowseService broseService)
            {
                _browseService = broseService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var catalog = await _browseService.GetCatalogUsingDF(request.Input);

                return new ResponseBase<Response> { Content = new Response { Items = catalog } };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.Input.Id).NotEmpty().WithMessage("Id can not be null");
            }
        }
    }
}
