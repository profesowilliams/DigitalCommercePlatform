using AutoMapper;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Common
{
    public class ProfileBase : Profile
    {
        public ProfileBase()
        {
            CreateMap<System.DateTime?, string>().ConvertUsing(new DateTimeToStringConverter());
        }
    }
}
