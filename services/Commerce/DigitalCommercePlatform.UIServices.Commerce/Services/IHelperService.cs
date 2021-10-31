//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface IHelperService
    {
        string GetParameterName(string parameter);
        bool GetOrderPricingConditions(string pricingConditionId, out TypeModel orderType, out LevelModel orderLevel);
        Task<string> GetOrderType(string poType, string docType);
        Task<List<Line>> PopulateLinesFor(List<Line> items, string vendorName);
    }
}
