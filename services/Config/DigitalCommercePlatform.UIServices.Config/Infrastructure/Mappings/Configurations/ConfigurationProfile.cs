using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations
{
    public class ConfigurationProfile : Profile
    {
        public ConfigurationProfile()
        {
            CreateMap<RecentConfigurationsModel, GetConfigurations.Response>()
                .ForMember(dest => dest.Configurations, opt => opt.MapFrom(src => src));

        }
    }
}