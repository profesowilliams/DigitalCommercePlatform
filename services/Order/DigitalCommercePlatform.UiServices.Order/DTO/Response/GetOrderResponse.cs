using DigitalFoundation.Core.Models.DTO.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.DTO.Response
{
    public class GetOrderResponse : Response<OrderDto>
    {
        public GetOrderResponse()
        {
        }

        public GetOrderResponse(OrderDto model)
        {
            ReturnObject = model;
        }
    }
}