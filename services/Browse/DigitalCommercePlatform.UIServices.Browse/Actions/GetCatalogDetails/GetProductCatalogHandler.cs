using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Services;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails
{
    [ExcludeFromCodeCoverage]
    public class GetProductCatalogHandler
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public ProductCatalog Input { get; set; }
            public Request(ProductCatalog input)
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
            private readonly IBrowseService _CatalogRepositoryService;

            public Handler(IBrowseService CatalogRepositoryServices, ICachingService cachingService)
            {
                _CatalogRepositoryService = CatalogRepositoryServices;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {

                var CatalogDetails = await _CatalogRepositoryService.GetProductCatalogDetails(request);    
                return new ResponseBase<Response> { Content = new Response { Items = CatalogDetails } };
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
