using MediatR;

namespace DigitalCommercePlatform.UIService.Order.Actions.Queries.GetSingleOrder
{
    public class GetSingleOrderQuery : IRequest<SingleOrderResponse>
    {
        public string Id { get; }

        public GetSingleOrderQuery(string id)
        {
            Id = id;
        }
    }
}
