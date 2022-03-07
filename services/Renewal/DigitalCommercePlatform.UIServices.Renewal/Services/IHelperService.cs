//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Services
{
    public interface IHelperService
    {
        Task<List<ItemModel>> PopulateLinesFor(List<ItemModel> items, string vendorName);
        string GetVendorLogo(string vendorName);
    }
}
