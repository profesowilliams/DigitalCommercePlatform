//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
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

        [ExcludeFromCodeCoverage]
        public class Response
        {
            public Address ShipTo { get; set; }
            public List<Address> EndUser { get; set; }
            public PaymentDetails PaymentDetails { get; set; }
            public string Customer { get; set; }
            public List<Line> Items { get; set; }
            public string OrderNumber { get; set; }
            public string PONumber { get; set; }
            public string EndUserPO { get; set; }
            public string PODate { get; set; }
            public bool BlindPackaging { get; set; }
            public bool ShipComplete { get; set; }
            public bool CanBeExpedited { get; set; }
            public string Status { get; set; }
            public Response(OrderDetailModel data)
            {
                ShipTo = data?.ShipTo;
                EndUser = data?.EndUser;
                PaymentDetails = data?.PaymentDetails;
                Customer = data?.Reseller?.CompanyName;
                Items = data?.Lines;                
                Status = data.Status.ToTitleCase();
                OrderNumber = data?.OrderNumber;
                PONumber = data?.PONumber;
                PODate = data?.PODate;
                EndUserPO = data?.EndUserPO;
                BlindPackaging = data.BlindPackaging;
                ShipComplete = data.ShipComplete;

            }
        }

        [ExcludeFromCodeCoverage]
        public class GetOrderHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IOrderService _orderQueryService;
            private readonly IHelperService _helperQueryService;
            private readonly IMapper _mapper;
            private readonly IOrderItemChildrenService _orderItemChildrenService;

            public GetOrderHandler(
                IOrderService orderQueryService,
                IHelperService helperQueryService,
                IMapper mapper, 
                IOrderItemChildrenService orderItemChildrenService
                )
            {
                _orderQueryService = orderQueryService;
                _helperQueryService = helperQueryService;
                _mapper = mapper;
                _orderItemChildrenService = orderItemChildrenService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var order = await _orderQueryService.GetOrderByIdAsync(request.Id);
                var orderResponse = _mapper.Map<OrderDetailModel>(order);
                var response = new Response(orderResponse);

                response.Items = _helperQueryService.PopulateLinesFor(response.Items, "","order").Result;


                if (response.Items != null)                
                    response.Items = _orderItemChildrenService.GetOrderLinesWithChildren(response);                    
                
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
