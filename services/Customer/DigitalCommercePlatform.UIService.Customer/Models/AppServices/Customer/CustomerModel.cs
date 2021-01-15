using DigitalFoundation.Common.MongoDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Customer.Models.AppServices.Customer
{
    public class CustomerModel
    {
        public Source Source { get; set; }
        public string Type { get; set; }
        public List<string> SalesOrg { get; set; }
        public string Classification { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZIP { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }
        public DateTime? Updated { get; set; }
    }
}
