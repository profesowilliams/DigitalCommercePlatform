//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order
{
    public interface IDigitalFoundationClient
    {
        Task<TResp> GetAsync<TResp>(string endpoint, string userId);
    }
}