using MediatR;

namespace DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Find
{
    public class FindCustomerRequest : IRequest<FindCustomerResponse>
    {        
        public string Id { get; set; }
    }
}
