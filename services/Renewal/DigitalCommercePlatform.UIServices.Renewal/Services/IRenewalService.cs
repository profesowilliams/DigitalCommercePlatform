//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Services
{
    public interface IRenewalService
    {
        Task<DetailedResponseModel> GetRenewalsDetailedFor(SearchRenewalDetailed.Request request);
        Task<SummaryResponseModel> GetRenewalsSummaryFor(SearchRenewalSummary.Request request);
        Task<RefinementGroupsModel> GetRefainmentGroup(RefinementRequest request);
        Task<List<QuoteDetailedModel>> GetRenewalsQuoteDetailedFor(GetRenewalQuoteDetailed.Request request);
    }
}
