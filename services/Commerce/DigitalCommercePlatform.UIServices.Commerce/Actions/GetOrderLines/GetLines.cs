using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderLines
{
    public sealed class GetLines
    {
        public class Request : IRequest<Response>
        {
            public string Id { get; }
            public Request(string id)
            {
                Id = id;                
            }
        }

        public class Response
        {
            public IEnumerable<Line> OrderLines { get; set; }
            public bool IsError { get; internal set; }
            public string ErrorCode { get; internal set; }
        }
        public class GetOrderLinesHandler : IRequestHandler<Request, Response>
        {
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;

            public GetOrderLinesHandler(ICommerceService commerceQueryService,
                IMapper mapper)
            {
                _commerceQueryService = commerceQueryService ?? throw new ArgumentNullException(nameof(commerceQueryService));                
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var order = await _commerceQueryService.GetOrderByIdAsync(request.Id);

                var orderLinesResponse = new Response();
                
                if (order == null)
                {
                    orderLinesResponse = new Response
                    {
                        OrderLines = null,
                        IsError = false,
                        ErrorCode = "No Lines found for order number " + request.Id
                    };
                }
                else
                {
                    var linesDto = _mapper.Map<IEnumerable<Line>>(order.Items);
                    orderLinesResponse = new Response
                    {
                        OrderLines = linesDto,
                        IsError = false,
                        ErrorCode = string.Empty
                    };
                }
                
                return orderLinesResponse; 
            }
        }
    }
}
