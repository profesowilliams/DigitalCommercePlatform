//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<DateTime, string>().ConvertUsing(dt => dt.ToString("MM/dd/yy"));
        }
    }
}