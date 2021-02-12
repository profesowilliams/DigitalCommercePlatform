using MediatR;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails
{
    public class GetCartRequest : IRequest<GetCartResponse>
    {
        public string userId { get; set; }
        public string customerId { get; set; }

        public GetCartRequest(string CustomerId, string UserId)
        {
            userId= UserId;
            customerId= CustomerId;
        }
    }
}
