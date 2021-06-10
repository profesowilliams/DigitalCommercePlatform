using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface IHelperService
    {
        string GetParameterName(string parameter);
        bool GetOrderPricingConditions(string pricingConditionId, out TypeModel orderType, out LevelModel orderLevel);
    }
}
