//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Actions.RegisterCustomer;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface ICustomerService
    {
        Task<ResponseBase<RegisterCustomer.Response>> RegisterCustomerAsync(RegisterCustomer.Request request, CancellationToken cancellationToken);
    }
}