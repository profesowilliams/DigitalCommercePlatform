using DigitalCommercePlatform.UIService.Customer.Models.Dtos;
using DigitalFoundation.Core.Models.DTO.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Get
{
    public class GetCustomerResponse : Response<GetCustomerDto>
    {
        public GetCustomerResponse()
        {
        }

        public GetCustomerResponse(GetCustomerDto model)
        {
            ReturnObject = model;
        }
    }
}
