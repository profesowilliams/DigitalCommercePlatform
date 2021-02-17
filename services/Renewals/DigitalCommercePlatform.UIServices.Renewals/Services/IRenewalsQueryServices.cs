using DigitalCommercePlatform.UIServices.Renewals.Actions.GetRenewals;
using DigitalCommercePlatform.UIServices.Renewals.Models;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewals.Services
{
    public interface IRenewalsQueryServices
    {
        Task<RenewalsDto> GetRenewalByIdAsync(string id);
        Task<RenewalsDto> GetRenewalsAsync(GetMultipleRenewals.Request request);
        Task <RenewalsSummaryModel> GetRenewalsSummaryAsync(string criteria);
    }
}
