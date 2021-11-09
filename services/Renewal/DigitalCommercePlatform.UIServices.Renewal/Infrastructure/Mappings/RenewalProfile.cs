//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class RenewalProfile : Profile
    {
        public RenewalProfile()
        {
            CreateMap<DateTime, string>().ConvertUsing(dt => dt.ToString("MM/dd/yy"));
        }
    }
}