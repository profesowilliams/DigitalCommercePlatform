//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using System.Collections.Generic;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;

namespace DigitalCommercePlatform.UIServices.Renewal.Services
{
    public interface IRenewalService
    {
        Task<List<DetailedModel>> GetRenewalsDetailedFor(SearchRenewalDetailed.Request request);
        Task<List<SummaryModel>> GetRenewalsSummaryFor(SearchRenewalSummary.Request request);
        Task<List<RenewalsModel>> GetRenewalsFor(GetRenewal.Request request);
    }
}
