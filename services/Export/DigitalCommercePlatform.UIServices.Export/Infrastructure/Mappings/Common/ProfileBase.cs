//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
using AutoMapper;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Common
{
    [ExcludeFromCodeCoverage]
    public class ProfileBase : Profile
    {
        public ProfileBase()
        {
            CreateMap<System.DateTime?, string>().ConvertUsing(new DateTimeToStringConverter());
        }
    }
}
