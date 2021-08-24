//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface IHelperService
    {
        string GetParameterName(string parameter);
        bool GetOrderPricingConditions(string pricingConditionId, out TypeModel orderType, out LevelModel orderLevel);

        Task<byte[]> GetQuoteDetailsAsXls(QuoteDetails quoteDetails);
    }
}
