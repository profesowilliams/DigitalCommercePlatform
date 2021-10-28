//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Services
{
    public interface IRenewalService
    {
        Task<List<RenewalsModel>> GetRenewalsFor(GetRenewal.Request request);
    }
}
