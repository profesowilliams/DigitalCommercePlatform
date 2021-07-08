using DigitalCommercePlatform.UIServices.Account.Actions.VendorDisconnect;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorRefreshToken;
using DigitalCommercePlatform.UIServices.Account.Models.Vendors;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface IVendorService
    {
        Task<bool> SetVendorConnection(Actions.ConnectToVendor.SetVendorConnection.Request request);
        Task<List<VendorConnection>> GetVendorConnectionsAsync();
        Task<VendorRefreshToken.Response> VendorRefreshToken(VendorRefreshToken.Request request);
        Task<bool> VendorDisconnect(GetVendorDisconnect.Request request);

    }
}
