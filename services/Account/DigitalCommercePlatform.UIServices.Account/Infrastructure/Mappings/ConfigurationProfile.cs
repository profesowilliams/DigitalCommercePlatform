//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class ConfigurationProfile : Profile
    {
        public ConfigurationProfile()
        {
            CreateMap<ConfigurationsSummaryModel, GetConfigurationsSummary.Response>()
                .ForMember(dest => dest.Summary, opt => opt.MapFrom(src => src));

            CreateMap<ActiveOpenConfigurationsModel, GetTopConfigurations.Response>()
               .ForMember(dest => dest.Summary, opt => opt.MapFrom(src => src));

        }
    }
}
