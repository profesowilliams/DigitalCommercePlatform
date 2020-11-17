using MediatR;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Orders.GetOrder
{
    public class GetOrderRequest : IRequest<GetOrderResponse>
    {        public string Id { get; set; }
    }
}
