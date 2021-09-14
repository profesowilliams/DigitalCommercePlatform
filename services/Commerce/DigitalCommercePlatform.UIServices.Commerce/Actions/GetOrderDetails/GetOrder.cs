//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails
{
    [ExcludeFromCodeCoverage]
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
            public OrderDetailModel Details { get; set; }
            public Address ShipTo { get; set; }
            public PaymentDetails PaymentDetails { get; set; }
            public string Customer { get; set; }
            public List<Line> Items { get; set; }

            public Response(OrderDetailModel data)
            {
                ShipTo = data?.ShipTo;
                PaymentDetails = data?.PaymentDetails;
                Customer = data?.Reseller?.CompanyName;
                Items = data?.Lines;
                Details = data;
                Details.Status = Details.Status.ToTitleCase();
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

            public class Validator : AbstractValidator<Request>
            {
                public Validator()
                {
                    RuleFor(c => c.Id).NotEmpty();
                }
            }
        }
    }
}
