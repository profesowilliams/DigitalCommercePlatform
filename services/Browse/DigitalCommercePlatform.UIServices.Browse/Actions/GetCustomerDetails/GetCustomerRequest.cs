using MediatR;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails
{
    public class GetCustomerRequest : IRequest<GetCustomerResponse>
    {
        public string id { get; set; }

        public GetCustomerRequest(string Id)
        {
            id = Id;
        }
    }
}
