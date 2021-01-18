using MediatR;

namespace DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Get
{
    public class GetCustomerRequest : IRequest<GetCustomerResponse>
    {
        public string Id { get; set; }
        public string SalesOrganization { get; set; }
        public string Country { get; set; }
        public string Language { get; set; }
    }
}
