using DigitalCommercePlatform.UIServices.Browse.DTO.Response;
using MediatR;

namespace DigitalCommercePlatform.UIServices.Customer.Actions.Customers.GetCustomer
{
    public class GetCustomerRequest : IRequest<GetCustomerResponse>
    {        public string Id { get; set; }
    }
}
