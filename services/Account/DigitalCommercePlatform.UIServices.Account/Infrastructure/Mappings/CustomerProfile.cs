using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.CustomerAddress;
using DigitalCommercePlatform.UIServices.Account.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            CreateMap< IEnumerable<AddressDetails>, GetAddress.Response>()
            .ForMember(dest => dest.Items, src => src.MapFrom(src => src));
        }
    }
}
