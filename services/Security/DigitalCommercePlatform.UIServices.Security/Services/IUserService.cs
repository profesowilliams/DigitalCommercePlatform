using DigitalCommercePlatform.UIServices.Security.Models;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Services
{
    public interface IUserService
    {
        Task<CoreUserDto> GetUserAsync(string applicationName, string token);
    }
}
