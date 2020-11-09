using DigitalCommercePlatform.UIServices.Order.DTO.Response;
using MediatR;

namespace DigitalCommercePlatform.UIServices.Order.DTO.Request
{
    public class GetOrderRequest : IRequest<GetOrderResponse>
    {
        public string Id { get; set; }
    }
}
