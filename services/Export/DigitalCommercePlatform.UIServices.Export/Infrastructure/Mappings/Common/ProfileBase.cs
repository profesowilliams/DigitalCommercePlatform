//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Common
{
    public class ProfileBase : Profile
    {
        public static readonly string PRICE_FORMAT = "{0:N2}";

        public ProfileBase()
        {
            CreateMap<System.DateTime?, string>().ConvertUsing(new DateTimeToStringConverter());
        }
    }
}
