using DigitalCommercePlatform.UIService.Customer.DTO;
using DigitalFoundation.Core.Models.DTO.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Response
{
    public class GetCustomerResponse : Response<CustomerDto>
    {
        public GetCustomerResponse()
        {
        }

        public GetCustomerResponse(CustomerDto model)
        {
            ReturnObject = model;
        }
    }
}
