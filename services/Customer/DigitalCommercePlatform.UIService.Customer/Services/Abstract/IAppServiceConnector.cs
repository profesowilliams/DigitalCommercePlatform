using DigitalCommercePlatform.UIService.Customer.Models.AppServices.Customer;
using DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Get;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Customer.Services.Abstract
{
    public interface IAppServiceConnector
    {
        Task<CustomerModel> GetCustomerAsync(GetCustomerRequest request);
    }
}
