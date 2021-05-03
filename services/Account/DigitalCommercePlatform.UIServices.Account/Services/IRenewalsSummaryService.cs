using DigitalCommercePlatform.UIServices.Account.Models.Renewals;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface IRenewalsSummaryService
    {
        List<RenewalsSummaryModel> GetSummaryItemsFrom(List<string> renewalsExpirationDates);
    }
}
