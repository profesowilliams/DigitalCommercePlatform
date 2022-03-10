//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Actions.ConnectToVendor;
using DigitalCommercePlatform.UIServices.Account.Actions.Refresh;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorAuthorizedURL;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorDisconnect;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorRefreshToken;
using DigitalCommercePlatform.UIServices.Account.Models.Vendors;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface IVendorService
    {
        Task<SetVendorConnection.Response> SetVendorConnection(SetVendorConnection.Request request);
        Task<List<VendorConnection>> GetVendorConnectionsAsync();
        Task<VendorRefreshToken.Response> VendorRefreshToken(VendorRefreshToken.Request request);
        Task<GetVendorDisconnect.Response> VendorDisconnect(GetVendorDisconnect.Request request);
        Task<string> VendorAutorizationURL(getVendorAuthorizeURL.Request request);
        RefreshData.Response RefreshVendor(RefreshData.Request request);
    }
}
