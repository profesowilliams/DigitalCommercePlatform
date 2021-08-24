//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            CreateMap<CustomerModel, GetCustomerHandler.Response>()
               .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.Source.ID));
        }
    }
}
