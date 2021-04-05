using AutoMapper;
using DigitalCommercePlatform.UIService.Browse.Models.Catalog;
using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails
{
    [ExcludeFromCodeCoverage]
    public static class GetHeaderHandler
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string CatalogCriteria { get; set; }

            public Request( string catalogCriteria)
            {
                CatalogCriteria = catalogCriteria;
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
            private readonly ILogger<Handler> _logger;

            public Handler(IBrowseService headerRepositoryServices,
                IMapper mapper,
                ILogger<Handler> logger)
            {
                _headerRepositoryServices = headerRepositoryServices;
                _logger = logger;
                _mapper = mapper;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var headerDetails = await _headerRepositoryServices.GetHeader(request);
                    var headerResponse = _mapper.Map<Response>(headerDetails);
                    return new ResponseBase<Response> { Content = headerResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at GetHeaderHandler : " + nameof(GetHeaderHandler));
                    throw;
                }
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