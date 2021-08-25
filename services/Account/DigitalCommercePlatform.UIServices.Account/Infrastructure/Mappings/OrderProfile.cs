//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.MyOrders;
using DigitalCommercePlatform.UIServices.Account.Actions.TopOrders;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Orders;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<MyOrdersDashboard, GetMyOrders.Response>()
                .ForMember(dest => dest.items, opt => opt.MapFrom(src => src));

            CreateMap<MyOrdersStatusDashboard, GetMyOrdersStatus.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

            CreateMap<OrderModel, OpenResellerItems>()
                .ForMember(dest => dest.Sequence, opt => opt.Ignore())
                .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.EndUserName, opt => opt.MapFrom(src => src.Reseller.Name)) 
                .ForMember(dest => dest.CurrencyCode, opt => opt.MapFrom(src => src.Currency))
                .ForMember(dest => dest.CurrencySymbol, opt => opt.MapFrom(src => src.CurrencySymbol))
                .ForMember(dest => dest.FormattedAmount, opt => opt.MapFrom(src => string.Format("{0:N2}", src.Price)));

            CreateMap<List<OpenResellerItems>, GetTopOrders.Response>()
           .ForMember(dest => dest.Summary, opt => opt.MapFrom(src => src));

        }
    }

}
