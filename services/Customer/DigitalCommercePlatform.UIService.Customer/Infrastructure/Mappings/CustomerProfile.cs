using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIService.Customer.Models.AppServices.Customer;
using DigitalCommercePlatform.UIService.Customer.Models.Dtos;

namespace DigitalCommercePlatform.UIService.Customer.Infrastructure.Mappings
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            CreateMap<CustomerModel, GetCustomerDto>();

        }
    }
}
