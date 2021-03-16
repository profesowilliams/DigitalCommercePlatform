using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuotes
{
    public class GetQuotes
    {
        public class Request : IRequest<Response>
        {
            public FindModel Search { get; set; }
           
            public Request(FindModel search)
            {
                Search = search;
            }
        }

        public class Response
        {
            public IEnumerable<RecentQuotesModel> Content { get; set; }
            public int? TotalItems { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public bool IsError { get; internal set; }
            public string ErrorCode { get; internal set; }
            public string ErrorDescription { get; set; }

        }
       
        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ISortingService _sortingService;
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;

            public Handler(ICommerceService commerceQueryService,ISortingService sortingService,IMapper mapper)
            {
                _commerceQueryService = commerceQueryService ?? throw new ArgumentNullException(nameof(commerceQueryService));
                _sortingService = sortingService ?? throw new ArgumentNullException(nameof(sortingService));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
               

                var orders = await _commerceQueryService.GetQuotesDetails(request);
                var ordersDto = _mapper.Map<IEnumerable<Response>>(orders);

                
                return ordersDto.FirstOrDefault();
            }
        }
    }
}
