using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
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
        public class Request : IRequest<ResponseBase<Response>>
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

            public Response(OrderDetailModel data)
            {
                ShipTo = data?.ShipTo;
                PaymentDetails = data?.PaymentDetails;
                Customer = data?.Reseller?.CompanyName;
                Lines = data?.Lines;
            }
        }

        public class GetOrderHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;

            public GetOrderHandler(ICommerceService commerceQueryService, IMapper mapper)
            {
                _commerceQueryService = commerceQueryService;
                _mapper = mapper;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var order = await _commerceQueryService.GetOrderByIdAsync(request.Id);
                var orderResponse = _mapper.Map<OrderDetailModel>(order);
                var response = new Response(orderResponse);
                return new ResponseBase<Response> { Content = response };
            }
        }
    }
}
