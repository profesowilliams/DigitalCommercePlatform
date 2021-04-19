using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models
{
    [ExcludeFromCodeCoverage]
    public class User
    {
        public string ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string CompanyName { get; set; } = "SHI International";
        public IEnumerable<string> Customers { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public IEnumerable<Customer> CustomersV2 { get; set; }
        public Customer ActiveCustomer { get; set; }
    }

    public class Customer
    {
        public string Number { get; set; }
        public string Name { get; set; }
    }
}
