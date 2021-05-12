using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations
{
    [ExcludeFromCodeCoverage]
    public class ConfigurationProfile : Profile
    {
        public ConfigurationProfile()
        {
            CreateMap<List<Configuration>, GetConfigurations.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

        }
    }
}