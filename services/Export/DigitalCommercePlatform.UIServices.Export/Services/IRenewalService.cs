//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models.Renewal;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Services
{
    public interface IRenewalService
    {
        Task<List<QuoteDetailedModel>> GetRenewalsQuoteDetailedFor(GetRenewalQuoteDetailedRequest request);
    }
}
