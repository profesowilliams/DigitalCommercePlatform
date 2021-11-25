using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using DigitalCommercePlatform.UIServices.Order.Models.Order;

namespace DigitalCommercePlatform.UIServices.Order.Services
{
    public interface IOrderService
    {
        Task<OrderModel> GetOrders(NuanceWebChatRequest request);
    }
}
