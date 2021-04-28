using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.MyOrders;
using DigitalCommercePlatform.UIServices.Account.Models.Orders;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class OrderProfile: Profile
    {
            public OrderProfile()
            {
               CreateMap<MyOrdersDashboard, GetMyOrders.Response>()
                   .ForMember(dest => dest.items, opt => opt.MapFrom(src => src));
            }
    }
}
