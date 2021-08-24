//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIService.Browse.Models.Catalog;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails
{
    public static class GetHeaderHandler
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string CatalogCriteria { get; set; }
            public bool IsDefault { get; set; } = true;

            public Request(string catalogCriteria, bool isDefault)
            {
                CatalogCriteria = catalogCriteria;
                IsDefault = isDefault;
            }
        }

        public class Response
        {
            public string UserId { get; set; }
            public string UserName { get; set; }
            public string CustomerId { get; set; }
            public string CustomerName { get; set; }
            public string CartId { get; set; }
            public int CartItemCount { get; set; }
            public IReadOnlyCollection<CatalogHierarchyModel> CatalogHierarchies { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IBrowseService _headerRepositoryServices;
            private readonly IMapper _mapper;

            public Handler(IBrowseService headerRepositoryServices,
                IMapper mapper)
            {
                _headerRepositoryServices = headerRepositoryServices;
                _mapper = mapper;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var headerDetails = await _headerRepositoryServices.GetHeader(request);
                var headerResponse = _mapper.Map<Response>(headerDetails);
                return new ResponseBase<Response> { Content = headerResponse };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.CatalogCriteria).NotEmpty().WithMessage("Please enter the input");
            }
        }
    }
}
