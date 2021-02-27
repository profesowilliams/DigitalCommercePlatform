using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails
{
    public sealed class GetOrder
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
            public OrderDetailModel details { get; set; }
            public Address ShipTo { get; set; }
            public PaymentDetails PaymentDetails { get; set; }
            public string Customer { get; set; }
            public List<Line> Lines { get; set; }
            public bool IsError { get; internal set; }
            public string ErrorCode { get; internal set; }

            public Response(OrderDetailModel data)
            {
                ShipTo = data?.ShipTo;
                PaymentDetails = data?.PaymentDetails;
                Customer = data?.Reseller?.CompanyName;
                Lines = data?.Lines;
            }
        }

        public class GetOrderHandler : IRequestHandler<Request, Response>
        {
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;

            public GetOrderHandler(ICommerceService commerceQueryService, IMapper mapper)
            {
                _commerceQueryService = commerceQueryService;
                _mapper = mapper;
            }
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var order = await _commerceQueryService.GetOrderByIdAsync(request.Id);
                var orderResponse = _mapper.Map<OrderDetailModel>(order);
                return new Response(orderResponse);
            }
        }
    }
}
