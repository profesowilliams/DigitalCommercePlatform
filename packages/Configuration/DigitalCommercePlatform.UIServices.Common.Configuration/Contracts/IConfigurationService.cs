using DigitalCommercePlatform.UIServices.Common.Configuration.Models.Configurations.Internal;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Configuration.Contracts
{
    public interface IConfigurationService
    {
        Task<T> GetAsync<T>(FindModel findModel) where T : class;
    }
}
