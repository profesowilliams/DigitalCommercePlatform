//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Product;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using DigitalFoundation.Common.Features.Client.Exceptions;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface IHelperService
    {
        string GetParameterName(string parameter);
        DateTime? GetDateParameter(DateTime date, string paramType);
        bool GetOrderPricingConditions(string pricingConditionId, out TypeModel orderType, out LevelModel orderLevel);
        Task<string> GetOrderType(string poType, string docType);
        Task<List<Line>> PopulateLinesFor(List<Line> items, string vendorName, string source);
        Task<AccountDetails> GetCustomerAccountDetails();
        AuthorizationModel MapAutorization(AuthorizationModel authorization);
        string GetCheckoutSystem(SourceModel source);
        Models.Order.Internal.OrderModel FilterOrderLines(Models.Order.Internal.OrderModel OrderDetail);
        Task<List<ItemModel>> PopulateQuoteRequestLinesForAsync(List<Common.Cart.Models.Cart.SavedCartLineModel> items, TypeModel type);
        List<Common.Cart.Models.Cart.SavedCartLineModel> PopulateSavedCartLinesForQuoteRequest(IReadOnlyList<Common.Cart.Models.Cart.ActiveCartLineModel> items);
        string RenderErrorMessage(RemoteServerHttpException ex,string errorFor);
    }
}
