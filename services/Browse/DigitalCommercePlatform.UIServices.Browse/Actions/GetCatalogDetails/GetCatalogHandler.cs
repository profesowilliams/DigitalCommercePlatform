//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails
{
    public static class GetCatalogHandler
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }

            public Request(string CatalogId)
            {
                Id = CatalogId;
            }
        }

        public class Response
        {
            public List<CatalogResponse> Items { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IBrowseService _CatalogRepositoryService;
            private readonly ICachingService _cachingService;

            public Handler(IBrowseService CatalogRepositoryServices, ICachingService cachingService)
            {
                _CatalogRepositoryService = CatalogRepositoryServices;
                _cachingService = cachingService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                //get catalog from cache
                var getCatalogResponse = await _cachingService.GetCatalogFromCache(request.Id);

                if (getCatalogResponse == null)
                {
                    var CatalogDetails = await _CatalogRepositoryService.GetCatalogDetails(request);
                    getCatalogResponse = CatalogDetails;
                }
                return new ResponseBase<Response> { Content = new Response { Items = getCatalogResponse } };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.Id).NotEmpty().WithMessage("Please enter the input");
            }
        }
    }
}
