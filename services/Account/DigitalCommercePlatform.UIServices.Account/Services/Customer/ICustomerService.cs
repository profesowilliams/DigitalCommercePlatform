//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Models.Customers;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface ICustomerService
    {
        Task<RegisterCustomerResponseModel> RegisterCustomerAsync(RegisterCustomerRequestModel request, CancellationToken cancellationToken = default);
    }
}