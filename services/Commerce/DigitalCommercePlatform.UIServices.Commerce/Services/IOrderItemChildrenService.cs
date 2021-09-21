//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface IOrderItemChildrenService
    {
       public List<Line> GetOrderLinesWithChildren(GetOrder.Response orderDetails);
    }
}
