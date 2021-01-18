using DigitalCommercePlatform.UIService.Customer.Models.Dtos;
using DigitalFoundation.Core.Models.DTO.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Find
{
    //TODO: replace by FindCustomerDto
    public class FindCustomerResponse : Response<GetCustomerDto>
    {
        public FindCustomerResponse()
        {
        }

        public FindCustomerResponse(GetCustomerDto model)
        {
            ReturnObject = model;
        }
    }
}
